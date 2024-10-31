import os
from BookingSystem import db, login_manager
from flask_login import UserMixin
from flask import url_for
from flask_mail import Message
from BookingSystem import mail, bcrypt
from flask import current_app 
from . import db 



from itsdangerous import URLSafeTimedSerializer as Serializer

@login_manager.user_loader
def load_user(user_id):
    user = UserAdmin.query.get(int(user_id))
    if user:
        return user

    user = UserTourOperator.query.get(int(user_id))
    if user:
        return user

    user = UserTraveler.query.get(int(user_id))
    if user:
        return user

    user = UserTourGuide.query.get(int(user_id))
    if user:
        return user

    return None  # No user found






# USERTRAVELER DATABASE
class UserTraveler(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    nationality = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(30), nullable=False, default='traveler')
    image_file = db.Column(db.String(50), nullable=False, default='default.jpg')
    confirmed = db.Column(db.Boolean, default=False)



    # (remaining methods...)


    # This is a function about reset password
    def get_reset_token(self, expires_sec=1800):
        """Generate a reset token that expires in expires_sec seconds."""
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps({'user_id': self.id})
    
    @staticmethod
    def verify_reset_token(token, expires_sec=1800):
        """Verify the reset token and return the user if valid."""
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token, max_age=expires_sec)['user_id']
        except:
            return None
        return UserTraveler.query.get(user_id)
    
    
    def send_reset_email(self):
        token = self.get_reset_token()
         # Check if the token is generated

        msg = Message('Password Reset Request', 
                      sender=os.environ.get('MAIL_DEFAULT_SENDER'), 
                      recipients=[self.email])
        msg.body = f'''To reset your password, visit the following link:
{url_for('main.traveler_reset_token', token=token, _external=True)}

If you did not make this request, simply ignore this email and no changes will be made.
'''
        print(f"Message created: {msg}")  # Check if msg is created correctly
        mail.send(msg)  # This should work now    
        

    def __repr__(self):
        return f"Traveler(' '{self.email}', '{self.image_file}')"

    def get_confirmation_token(self, expires_sec=3600):
        s = Serializer(current_app.config['SECRET_KEY'])  # Replace with your actual secret key
        return s.dumps({'user_id': self.id}, salt='traveler-email-confirm')

    @staticmethod
    def verify_confirmation_token(token, expires_sec=3600):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            # Load the user_id from the token
            user_id = s.loads(token, salt='traveler-email-confirm', max_age=expires_sec)['user_id']
            print(f"Decoded user_id: {user_id}")  # For debugging
        except Exception as e:
            print(f"Error loading token: {e}")  # For debugging
            return None
        # Query the database using the correct primary key field
        return UserTraveler.query.get(user_id) 

    # Define the email sending function
    
def send_confirmation_traveler_email(user):
    token = user.get_confirmation_token()  # Call the correct method
    msg = Message('Confirm Your Email', recipients=[user.email])
    # Inside send_confirmation_email function
    msg.body = f'''To confirm your email, visit the following link:
    {url_for('main.confirm_email', token=token, _external=True)}
    '''

    mail.send(msg)
    
    


#########

class UserAdmin(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    role = db.Column(db.String(30), nullable=False, default='admin')
    confirmed = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        return f'<UserAdmin {self.email}>'

class UserTourOperator(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    role = db.Column(db.String(30), nullable=False, default='touroperator')
    confirmed = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        return f'<UserTouroperator {self.email}>'
    
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    


class UserTourGuide(db.Model):
    __tablename__ = 'Tour_Guide'  # Corrected from _tablename_ to __tablename__
    id = db.Column(db.Integer, primary_key=True, unique=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(30), nullable=False, default='tourguide')
    image_file = db.Column(db.String(50), nullable=False, default='default.jpg')
    accredited_num = db.Column(db.String(50))
    bio = db.Column(db.Text)
    confirmed = db.Column(db.Boolean, default=True)
    specialization = db.Column(db.String(255))
    active = db.Column(db.Boolean, default=False)

    # Relationships
    characteristics = db.relationship('Characteristic', backref='tour_guide', cascade="all, delete-orphan")
    skills = db.relationship('Skill', backref='tour_guide', cascade="all, delete-orphan")
    
    @property
    def is_active(self):
        return self.active  # Return the active status of the user

    @property
    def is_authenticated(self):
        return True  # This is always true for a logged-in user

    @property
    def is_anonymous(self):
        return False  # This is always false for a logged-in user
    
    def get_id(self):
        return self.id  # Return the unique identifier for the user

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def __repr__(self):
        return f'<TourGuide {self.email}>'


class Characteristic(db.Model):
    __tablename__ = 'Characteristic'  # Corrected from _tablename_ to __tablename__
    id = db.Column(db.Integer, primary_key=True, unique=True)
    tguide_id = db.Column(db.Integer, db.ForeignKey('Tour_Guide.id'), nullable=False)
    characteristic = db.Column(db.String(100))


class Skill(db.Model):
    __tablename__ = 'Skill'  # Corrected from _tablename_ to __tablename__
    id = db.Column(db.Integer, primary_key=True, unique=True)
    tguide_id = db.Column(db.Integer, db.ForeignKey('Tour_Guide.id'), nullable=False)
    skill = db.Column(db.String(100))



    
    
    
