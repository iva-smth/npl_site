from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render, redirect
from django.contrib.admin.views.decorators import staff_member_required

@staff_member_required
def admin_entry_point(request):
    """
    Точка входа в админку.
    Доступна только пользователям с is_staff=True.
    Обычные пользователи получат 403 или редирект на логин.
    """
    return redirect('/admin/')