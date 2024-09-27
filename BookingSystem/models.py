from BookingSystem import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_traveler(traveler):
    return UserTraveler.query.get(int(traveler))

@login_manager.user_loader
def load_tourguide(tourguide):
    return UserTourGuide.query.get(int(tourguide))

class UserTraveler(db.Model, UserMixin):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    confirm_email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(50), nullable=False)
    sex = db.Column(db.String(30), nullable=False)
    nationality = db.Column(db.String(50), nullable=False) 
    password = db.Column(db.String(150), nullable=False)
    image_file = db.Column(db.String(50), nullable=False, default='default.jpg')

    def __repr__(self):
        return f"Traveler('{self.username}', '{self.email}', '{self.image_file}')"

class UserTourGuide(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    confirm_email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    sex = db.Column(db.String(30), nullable=False)
    nationality = db.Column(db.String(50), nullable=False) 
    password = db.Column(db.String(150), nullable=False)
    image_file = db.Column(db.String(50), nullable=False, default='default.jpg')

    def __repr__(self):
        return f"TourGuide('{self.username}', '{self.email}', '{self.image_file}')"
