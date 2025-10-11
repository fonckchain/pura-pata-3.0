from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from uuid import UUID


class DogBase(BaseModel):
    name: str
    age_years: int
    age_months: int = 0
    breed: str
    size: str  # pequeño, mediano, grande
    gender: str  # macho, hembra
    color: Optional[str] = None
    description: Optional[str] = None
    vaccinated: bool = False
    sterilized: bool = False
    dewormed: bool = False
    special_needs: Optional[str] = None
    latitude: float
    longitude: float
    address: Optional[str] = None
    province: Optional[str] = None
    canton: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    has_whatsapp: bool = False


class DogCreate(DogBase):
    photos: List[str]
    certificate: Optional[str] = None


class DogUpdate(BaseModel):
    name: Optional[str] = None
    age_years: Optional[int] = None
    age_months: Optional[int] = None
    breed: Optional[str] = None
    size: Optional[str] = None
    gender: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    vaccinated: Optional[bool] = None
    sterilized: Optional[bool] = None
    dewormed: Optional[bool] = None
    special_needs: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    province: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    has_whatsapp: Optional[bool] = None
    photos: Optional[List[str]] = None
    certificate: Optional[str] = None


class DogStatusUpdate(BaseModel):
    status: str  # disponible, reservado, adoptado


class DogResponse(DogBase):
    id: UUID
    photos: List[str]
    certificate: Optional[str] = None
    status: str
    publisher_id: UUID
    created_at: datetime
    updated_at: datetime
    adopted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class StatusHistoryResponse(BaseModel):
    id: UUID
    dog_id: UUID
    old_status: Optional[str]
    new_status: str
    changed_at: datetime

    class Config:
        from_attributes = True
