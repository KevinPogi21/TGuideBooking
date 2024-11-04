from flask import render_template, redirect, url_for, flash, request, session, jsonify, current_app
from flask_login import login_required, current_user, logout_user, login_user
from BookingSystem.TourOperator_Page import touroperator
from . import tourguide  
from BookingSystem.TourOperator_Page.form import UserTourGuideForm
from BookingSystem import bcrypt, db
from werkzeug.security import check_password_hash, generate_password_hash



# Route to view the profile of a specific tour guide
@tourguide.route('/view_tourguide/<int:guide_id>', methods=['GET'])
@login_required
def view_tourguide(guide_id):
    guide = UserTourGuide.query.get_or_404(guide_id)
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
        current_user.fname = data.get('first_name') or current_user.fname
        current_user.lname = data.get('last_name') or current_user.lname
        current_user.email = data.get('email') or current_user.email
        current_user.contact_number = data.get('contact_number') or current_user.contact_number

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



@tourguide.route('/save-contact', methods=['POST'])
@login_required
def save_contact():
    data = request.get_json()
    new_contact_number = data.get('contact_number')

    if new_contact_number:
        try:
            current_user.contact_number = new_contact_number
            db.session.commit()
            return jsonify({'success': True}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Error saving contact number: {e}")
            return jsonify({'success': False, 'error': 'Could not update contact number'}), 500
    return jsonify({'success': False, 'error': 'Invalid contact number'}), 400


















# Logout route
@tourguide.route('/logout')
@login_required
def logout():
    logout_user()
    session.clear()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('main.home'))





