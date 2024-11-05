from flask import render_template, redirect, url_for, flash, request, session, jsonify, current_app
from flask_login import login_required, current_user, logout_user, login_user
from BookingSystem.TourOperator_Page import touroperator
from . import tourguide  
from BookingSystem.TourOperator_Page.form import UserTourGuideForm
from BookingSystem import bcrypt, db
from werkzeug.security import check_password_hash, generate_password_hash
from BookingSystem.models import User, Characteristic, Skill, Availability, TourGuide
from .form import PasswordConfirmationForm


# Route to view the profile of a specific tour guide
@tourguide.route('/view_tourguide/<int:guide_id>', methods=['GET'])
@login_required
def view_tourguide(guide_id):
    guide = User.query.get_or_404(guide_id)
    return render_template('tourguide_dashboard.html', guide=guide)

# Route to save profile changes made by the tour guide
@tourguide.route('/save_profile', methods=['POST'])
@login_required
def save_profile():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data received.'}), 400

        # Update the current user's profile fields
        current_user.first_name = data.get('first_name') or current_user.first_name
        current_user.last_name = data.get('last_name') or current_user.last_name
        current_user.email = data.get('email') or current_user.email
        
         # Update the contact number in the TourGuide model
        if current_user.tour_guide:
            current_user.tour_guide.contact_num = data.get('contact_number') or current_user.tour_guide.contact_num

        # Commit changes to the database
        db.session.commit()

        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error saving profile: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# Tour guide dashboard route
@tourguide.route('/tourguide_dashboard')
@login_required
def tourguide_dashboard():
    print(f"Current user in dashboard: {current_user.email}, Role: {current_user.role}")
    return render_template('tourguide_dashboard.html')






@tourguide.route('/confirm-password', methods=['POST'])
@login_required
def confirm_password():
    data = request.get_json()
    password = data.get('password')

    # Check if the entered password matches the user's current password
    if password and bcrypt.check_password_hash(current_user.password, password):
        return jsonify({'success': True}), 200
    return jsonify({'success': False, 'error': 'Incorrect password'}), 401



# Logout route
@tourguide.route('/logout')
@login_required
def logout():
    logout_user()
    session.clear()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('main.home'))







@tourguide.route('/verify_password', methods=['POST'])
@login_required
def verify_password():
    data = request.get_json()
    password = data.get('password')

    # Check if password is provided
    if not password:
        return jsonify({"success": False, "message": "Password is required for verification."}), 400

    # Verify the password
    password_is_correct = current_user.check_password(password) if hasattr(current_user, 'check_password') else check_password_hash(current_user.password, password)
    
    if password_is_correct:
        return jsonify({"success": True, "message": "Password verified successfully."}), 200
    else:
        return jsonify({"success": False, "message": "Incorrect password. Please try again."}), 401



@tourguide.route('/update_contact', methods=['POST'])
@login_required
def update_contact():
    data = request.get_json()
    new_contact = data.get('contact_number')

    # Check if new contact number is provided
    if not new_contact:
        return jsonify({"success": False, "message": "Contact number is required."}), 400

    # Update the contact number
    try:
        current_user.tour_guide.contact_num = new_contact
        db.session.commit()
        return jsonify({"success": True, "message": "Contact number updated successfully."}), 200
    except Exception as e:
        db.session.rollback()
        print("Database error:", e)
        return jsonify({"success": False, "message": "Failed to update contact number due to a database error."}), 500





