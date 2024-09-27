from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from BookingSystem.models import UserTraveler, UserTourGuide

class TravelerRegistrationForm(FlaskForm):
    email_address = StringField('Email Address', validators=[DataRequired(), Length(min=2, max=30)])
    confirm_email = StringField('Confirm Email', validators=[DataRequired(), Email(), EqualTo('email_address', message='Emails must match')])
    username = StringField('Username', validators=[DataRequired()])
    sex = SelectField('Sex', choices=[('male', 'Male'), ('female', 'Female')], validators=[DataRequired()])
    nationality = SelectField('Nationality', choices=[        ('Philippines', 'Philippines'),
        ('United States', 'United States'),
        ('Japan', 'Japan'),
        ('Canada', 'Canada'),], validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message='Passwords must match')])
    submit = SubmitField('Sign Up')
    
    def validate_username(self, username):
        traveler = UserTraveler.query.filter_by(username = username.data).first()
        if traveler:
            raise ValidationError('That username is taken. Please Choose a different one.')
        
    def validate_email_address(self, email_address):
        traveler = UserTraveler.query.filter_by(email = email_address.data).first()
        if traveler:
            raise ValidationError('That Email is taken. Please Choose a different one.')

class TravelerLoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class TourGuideRegistrationForm(FlaskForm):
    email_address = StringField('Email Address', validators=[DataRequired(), Length(min=2, max=20)])
    confirm_email = StringField('Confirm Email', validators=[DataRequired(), Email(), EqualTo('email_address', message='Emails must match')])
    username = StringField('Username', validators=[DataRequired()])
    sex = SelectField('Sex', choices=[ ('male', 'Male'), ('female', 'Female')], validators=[DataRequired()])
    nationality = SelectField('Nationality', choices=[        ('Philippines', 'Philippines'),
        ('United States', 'United States'),
        ('Japan', 'Japan'),
        ('Canada', 'Canada'),], validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message='Passwords must match')])
    submit = SubmitField('Sign Up')

class TourGuideForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')
