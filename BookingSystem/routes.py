from flask import Blueprint, render_template, url_for, flash, redirect
from BookingSystem import db, bcrypt
from BookingSystem.forms import TravelerLoginForm, TravelerRegistrationForm, TourGuideForm, TourGuideRegistrationForm
from BookingSystem.models import UserTraveler, UserTourGuide
from flask_login import login_user

main = Blueprint('main', __name__)  # Ensure the 'main' blueprint is set

@main.route('/')
@main.route('/home')
def home():
    return render_template('home.html')

@main.route('/register')
def register():
    return render_template('register.html')

@main.route('/traveler_login', methods=['GET', 'POST'])
def traveler_login():
    form = TravelerLoginForm()
    if form.validate_on_submit():
        traveler = UserTraveler.query.filter_by(email=form.email.data).first()
        if traveler and bcrypt.check_password_hash(traveler.password, form.password.data):
            login_user(traveler)
            return redirect(url_for('main.home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('traveler_login.html', title='TravelerLogin', form=form)

@main.route('/traveler_register', methods=['GET', 'POST'])
def traveler_register():
    form = TravelerRegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        new_traveler = UserTraveler(
            email=form.email_address.data,
            confirm_email=form.confirm_email.data,
            username=form.username.data,
            sex=form.sex.data,
            nationality=form.nationality.data, 
            password=hashed_password,
            image_file='default.jpg'
        )
        db.session.add(new_traveler)
        db.session.commit()
        flash(f'Account created for Traveler {form.username.data}!', 'success')
        return redirect(url_for('main.home'))
    else:
        print(form.errors)
    return render_template('traveler_register.html', title='TravelerRegister', form=form)

@main.route('/tourguidelogin', methods=['GET', 'POST'])
def tourguide_login():
    form = TourGuideForm()
    if form.validate_on_submit():
        tourguide = UserTourGuide.query.filter_by(email=form.email.data).first()
        if tourguide and bcrypt.check_password_hash(tourguide.password, form.password.data):
            login_user(tourguide)
            return redirect(url_for('main.home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('tourguidelogin.html', title='TourGuideLogin', form=form)

@main.route('/tourguideregister', methods=['GET', 'POST'])
def tourguide_register():
    form = TourGuideRegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        new_tour_guide = UserTourGuide(
            email=form.email_address.data,
            confirm_email=form.confirm_email.data,
            username=form.username.data,
            sex=form.sex.data,
            nationality=form.nationality.data, 
            password=hashed_password,
            image_file='default.jpg'
        )
        db.session.add(new_tour_guide)
        db.session.commit()
        flash(f'Account created for TourGuide {form.username.data}!', 'success')
        return redirect(url_for('main.tourguide_dashboard'))
    else:
        print(form.errors)
    return render_template('tourguideregister.html', title='TourGuideRegister', form=form)

@main.route('/tourguide_dashboard')
def tourguide_dashboard():
    return render_template('tourguide_dashboard.html')
