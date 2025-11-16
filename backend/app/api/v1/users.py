from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, load_only
from sqlalchemy import text
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user_id, get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse

router = APIRouter()


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_data: UserCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Create a new user profile (must be authenticated with Supabase)
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.id == current_user_id).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User profile already exists"
        )

    # Create user with Supabase Auth ID
    user_dict = user_data.model_dump()
    user = User(id=current_user_id, **user_dict)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Get current user profile
    """
    # Use explicit column selection to avoid location column error
    # This ensures we only query columns that exist in the model
    try:
        user = db.query(User).options(
            load_only(
                User.id,
                User.email,
                User.name,
                User.phone,
                User.province,
                User.canton,
                User.latitude,
                User.longitude,
                User.created_at
            )
        ).filter(User.id == current_user_id).first()
    except Exception as e:
        # Fallback: use raw SQL if load_only doesn't work due to metadata issues
        if "location" in str(e).lower() or "undefinedcolumn" in str(e).lower():
            # Use raw SQL to explicitly select only existing columns
            result = db.execute(
                text("""
                    SELECT id, email, name, phone, province, canton, 
                           latitude, longitude, created_at
                    FROM users
                    WHERE id = :user_id
                """),
                {"user_id": current_user_id}
            ).first()
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User profile not found. Please complete registration."
                )
            # Convert result to User object
            user = User(
                id=result.id,
                email=result.email,
                name=result.name,
                phone=result.phone,
                province=result.province,
                canton=result.canton,
                latitude=result.latitude,
                longitude=result.longitude,
                created_at=result.created_at
            )
        else:
            raise
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found. Please complete registration."
        )
    return user


@router.put("/me", response_model=UserResponse)
def update_user_profile(
    user_data: UserUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Update current user profile
    """
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    for key, value in user_data.model_dump(exclude_unset=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    """
    Get user by ID
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
