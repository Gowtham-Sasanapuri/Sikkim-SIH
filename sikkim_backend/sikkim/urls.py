from django.urls import path
from . import views

urlpatterns = [
    path("user_registration/",views.User_Registration),
    path("Guide_Registration/",views.Guide_Registration),
    path("User_LogIn/",views.User_Login),
    path("Guide_LogIn/",views.Guide_login),
    path("guide_list/",views.view_guides),
    path("book_guide/",views.book_guide),
    path("get_status/",views.get_status),
    path("get_status_for_guide/",views.guide_status),
    path('delete-all/', views.delete_all_data), #deleting all data
    path("updating_status/",views.accept_or_reject),
    path("all_data/", views.all_users_and_guides),
    path("store_itinerary/",views.store_itinerary),
    path("already_created_user_details/",views.itinerary),
    path("find_itinerary_for_<int:id>/",views.get_itinerary),
    path("get_guide_details/",views.get_guide_details),
    path("update_guide_profile/",views.update_guide_details),
    path("chat/", views.chat, name="chat"),
    path("get_user_details/",views.get_user_details),
    path("update_user_profile/",views.update_user_details),
    path("get_itinerary_for_user/",views.get_itinerary_for_user),
    path("update_itinerary/",views.updating_itinerary),
    path("trip_completion/",views.update_complete_itinerary),
    path("past_tourist/",views.past_tourist),
]