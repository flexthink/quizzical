
"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

Scaffolding - to be removed in the final version
"""

from core.models import User

GUEST_USER_UUID = 'a2e47480-69b6-4445-b252-03071927d598'


# TODO: Remove the entire guest user concept
def _create_guest():
    user = User(
        uuid=GUEST_USER_UUID,
        first_name='Guest',
        last_name='Guest'
    )
    user.save()
    return user

def guest():
    """
    Retrieves a guest user, creating one if necessary
    """
    user = User.objects(uuid=GUEST_USER_UUID).first()
    if not user:
        user = _create_guest()
    return user
