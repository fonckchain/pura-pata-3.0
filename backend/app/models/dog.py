from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, ARRAY, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid


class Dog(Base):
    __tablename__ = "dogs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    age_years = Column(Integer, nullable=False)
    age_months = Column(Integer, default=0)
    breed = Column(String(100), nullable=False)
    size = Column(String(20), nullable=False)  # pequeño, mediano, grande
    gender = Column(String(10), nullable=False)
    description = Column(Text, nullable=True)

    vaccinated = Column(Boolean, default=False)
    sterilized = Column(Boolean, default=False)
    dewormed = Column(Boolean, default=False)
    special_needs = Column(Text, nullable=True)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    province = Column(String(50), nullable=True)
    canton = Column(String(50), nullable=True)

    contact_phone = Column(String(20), nullable=True)
    contact_email = Column(String(255), nullable=True)
    has_whatsapp = Column(Boolean, default=False)

    photos = Column(ARRAY(Text), nullable=False)
    certificate = Column(Text, nullable=True)

    status = Column(String(20), default='disponible')  # disponible, reservado, adoptado

    publisher_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    adopted_at = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        CheckConstraint(
            "status IN ('disponible', 'reservado', 'adoptado')",
            name='valid_status'
        ),
    )
