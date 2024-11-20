from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, DecimalField, FormField, FieldList, FileField
from wtforms.validators import DataRequired, Email, EqualTo, ValidationError, Length, NumberRange
from BookingSystem.models import User
from wtforms.fields import FileField, DecimalField
from flask_wtf.file import FileField, FileAllowed


def UppercaseValidator(form, field):
    if not any(char.isupper() for char in field.data):
        raise ValidationError('Password must contain at least one uppercase letter.')

def LowercaseValidator(form, field):
    if not any(char.islower() for char in field.data):
        raise ValidationError('Password must contain at least one lowercase letter.')

def DigitalValidator(form, field):
    if not any(char.isdigit() for char in field.data):
        raise ValidationError('Password must contain at least one digit.')

def SpecialCharacterValidator(form, field):
    if not any(char in "!@#$%^&*()_+-=[]{}|;':,.<>?/" for char in field.data):
        raise ValidationError('Password must contain at least one special character.')
    


class UserTourGuideForm(FlaskForm):
    fname = StringField('First Name', validators=[DataRequired()])
    lname = StringField('Last Name', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email(), Length(min=6, max=300)])
    contact_number = StringField('Contact Number', validators=[DataRequired()])
    password = PasswordField('Password', validators=[
        DataRequired(),
        Length(min=8, message='Password must be at least 8 characters long.'),
        UppercaseValidator,
        LowercaseValidator,
        DigitalValidator,
        SpecialCharacterValidator
    ])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message="Passwords must match.")])
    submit = SubmitField('Create Account')

    def validate_email(self, email):
        # Check if the email is already used by a tour guide
        tour_guide = User.query.filter_by(email=email.data).first()
        if tour_guide:
            raise ValidationError('That email is already in use. Please choose a different one.')
