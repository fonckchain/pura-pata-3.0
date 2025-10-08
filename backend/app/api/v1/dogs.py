from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Optional
from uuid import UUID
from datetime import datetime
import math

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.dog import Dog
from app.models.status_history import DogStatusHistory
from app.schemas.dog import DogCreate, DogUpdate, DogResponse, DogStatusUpdate, StatusHistoryResponse

router = APIRouter()


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two points in kilometers using Haversine formula
    """
    R = 6371  # Earth's radius in km

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


@router.get("", response_model=List[DogResponse])
def get_dogs(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None),
    size: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    province: Optional[str] = Query(None),
    vaccinated: Optional[bool] = Query(None),
    sterilized: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Get all dogs with optional filters
    """
    query = db.query(Dog)

    if status:
        query = query.filter(Dog.status == status)
    if size:
        query = query.filter(Dog.size == size)
    if gender:
        query = query.filter(Dog.gender == gender)
    if province:
        query = query.filter(Dog.province == province)
    if vaccinated is not None:
        query = query.filter(Dog.vaccinated == vaccinated)
    if sterilized is not None:
        query = query.filter(Dog.sterilized == sterilized)

    dogs = query.order_by(Dog.created_at.desc()).offset(skip).limit(limit).all()
    return dogs


@router.get("/me", response_model=List[DogResponse])
def get_my_dogs(
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Get current user's dogs
    """
    dogs = db.query(Dog).filter(Dog.publisher_id == current_user_id).order_by(Dog.created_at.desc()).all()
    return dogs


@router.get("/nearby", response_model=List[DogResponse])
def get_nearby_dogs(
    latitude: float = Query(...),
    longitude: float = Query(...),
    radius: int = Query(50, description="Radius in kilometers"),
    db: Session = Depends(get_db),
):
    """
    Get dogs within a certain radius of a location
    """
    dogs = db.query(Dog).filter(Dog.status == 'disponible').all()

    # Filter by distance
    nearby_dogs = [
        dog for dog in dogs
        if calculate_distance(latitude, longitude, dog.latitude, dog.longitude) <= radius
    ]

    return nearby_dogs


@router.get("/{dog_id}", response_model=DogResponse)
def get_dog(
    dog_id: UUID,
    db: Session = Depends(get_db),
):
    """
    Get dog by ID
    """
    dog = db.query(Dog).filter(Dog.id == dog_id).first()
    if not dog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dog not found"
        )
    return dog


@router.post("", response_model=DogResponse, status_code=status.HTTP_201_CREATED)
def create_dog(
    dog_data: DogCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Create a new dog listing
    """
    dog = Dog(
        **dog_data.model_dump(),
        publisher_id=current_user_id
    )
    db.add(dog)
    db.commit()
    db.refresh(dog)

    # Create status history
    history = DogStatusHistory(
        dog_id=dog.id,
        old_status=None,
        new_status='disponible'
    )
    db.add(history)
    db.commit()

    return dog


@router.put("/{dog_id}", response_model=DogResponse)
def update_dog(
    dog_id: UUID,
    dog_data: DogUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Update a dog listing
    """
    dog = db.query(Dog).filter(Dog.id == dog_id).first()
    if not dog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dog not found"
        )

    if str(dog.publisher_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this dog"
        )

    for key, value in dog_data.model_dump(exclude_unset=True).items():
        setattr(dog, key, value)

    db.commit()
    db.refresh(dog)
    return dog


@router.patch("/{dog_id}/status", response_model=DogResponse)
def update_dog_status(
    dog_id: UUID,
    status_data: DogStatusUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Update dog status (disponible, reservado, adoptado)
    """
    dog = db.query(Dog).filter(Dog.id == dog_id).first()
    if not dog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dog not found"
        )

    if str(dog.publisher_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this dog"
        )

    old_status = dog.status
    new_status = status_data.status

    if new_status not in ['disponible', 'reservado', 'adoptado']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status"
        )

    dog.status = new_status
    if new_status == 'adoptado':
        dog.adopted_at = datetime.utcnow()

    # Create status history
    history = DogStatusHistory(
        dog_id=dog.id,
        old_status=old_status,
        new_status=new_status
    )
    db.add(history)

    db.commit()
    db.refresh(dog)
    return dog


@router.delete("/{dog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dog(
    dog_id: UUID,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Delete a dog listing
    """
    dog = db.query(Dog).filter(Dog.id == dog_id).first()
    if not dog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dog not found"
        )

    if str(dog.publisher_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this dog"
        )

    db.delete(dog)
    db.commit()
    return None


@router.get("/{dog_id}/history", response_model=List[StatusHistoryResponse])
def get_dog_status_history(
    dog_id: UUID,
    db: Session = Depends(get_db),
):
    """
    Get dog status history
    """
    dog = db.query(Dog).filter(Dog.id == dog_id).first()
    if not dog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dog not found"
        )

    history = db.query(DogStatusHistory).filter(
        DogStatusHistory.dog_id == dog_id
    ).order_by(DogStatusHistory.changed_at.desc()).all()

    return history
