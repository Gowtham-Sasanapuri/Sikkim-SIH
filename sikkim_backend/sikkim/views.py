from django.shortcuts import render,HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Users,Tourist_Guide,Book_guide,Itinerary
from .serializer import ser_users,ser_touristGuide,ser_book_guide,ser_itinerary
from datetime import datetime
from django.views.decorators.http import require_http_methods
import jwt
import google.generativeai as genai

genai.configure(api_key="AIzaSyBEy0mTiiv32Fx4oiX5e5iV9iBq3qpdvV0")

model = genai.GenerativeModel(
    "gemini-2.5-flash",
    system_instruction="""
You are an expert Sikkim Tourism Assistant. 

- You **must only answer questions** about Sikkim tourism.  
- Topics you can answer include: 
  - Monasteries
  - Tourist attractions
  - Hotels and accommodations
  - Local food & culture
  - Transport
  - Weather & best time to visit
  - Heritage & architecture
  - Sikkim state
- You **must always respond in the same language** the user is using.
- If a question is outside, respond: "I'm sorry, I can only provide information about Sikkim tourism based on the topics listed."
"""
)

@api_view(["POST"])
def chat(request):
    user_message = request.data.get("message")
    if not user_message:
        return Response({"error": "Message is required"}, status=400)

    try:
        response = model.generate_content(user_message)
        return Response({"reply": response.text})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
def User_Registration(request):
    users_data = request.data
    ser = ser_users(data = users_data)
    try:
        if ser.is_valid():
            ser.save()
            return Response({"success" : True,"msg":"Successfully Registered"})
        else:
            return Response({"success": False, "msg": "Validation failed", "errors": ser.errors}, status=400)
    except Exception as e:
        return Response({"success":False,"msg": f"Error Occurred {e}"})

@api_view(["POST"])
def Guide_Registration(request):
    guide_data = request.data
    ser = ser_touristGuide(data = guide_data)
    try:
        if ser.is_valid():
            ser.save()
            return Response({"success":True,"msg" : "Successfully Registered"})
        else:
            return Response({"success": False, "msg": "Validation failed", "errors": ser.errors}, status=400)
    except Exception as e:
        return Response({"success":False,"msg":f"Error Occurred{e}"})

@api_view(["POST"])
def User_Login(request):
    username = request.data.get("username").strip()
    password = request.data.get("password").strip()
    print(request.data)
    print("Received:", username, password)
    try:
        user = Users.objects.get(UserName = username)
        if password == user.PassWord:
            return Response({"success":True,"msg" : "Successfully Logged In"})
        else:
            return Response({"success":False,"msg" : "invalid Username or Password"})
    except Users.DoesNotExist:
        return Response({"success": False, "msg": "User does not exist"})
    except Exception as e:
        return Response({"success":False,"msg" : f"Error {e}"})

@api_view(["POST"])
def Guide_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    try:
        user = Tourist_Guide.objects.get(Guide_Username = username)
        if password == user.Guide_PassWord:
            return Response({"success":True,"msg" : "Successfully Logged In"})
        else:
            return Response({"success":False,"msg" : "invalid Username or Password"})
    except Tourist_Guide.DoesNotExist:
        return Response({"success": False, "msg": "User does not exist"})
    except Exception as e:
        return Response({"success":False,"msg" : f"Error {e}"})

@api_view(["GET"])
def view_guides(request):
    data = Tourist_Guide.objects.all()
    ser = ser_touristGuide(data,many = True)
    return Response({"success":True,"guide_li":ser.data})

@api_view(["POST"])
def book_guide(request):
    user = request.data.get("username")
    guide = request.data.get("guide")
    from_date = request.data.get("from_date")
    to_date = request.data.get("to_date")
    try:
        user_id = Users.objects.get(UserName = user).id
        guide_id = Tourist_Guide.objects.get(Guide_Username = guide).id
        ser_obj = ser_book_guide(data = {"user":user_id,"G_userName":guide_id,"to_date":to_date,"from_date":from_date})
        if ser_obj.is_valid():
            ser_obj.save()
            return Response({"success":True,"msg":"Your Request reached to the Guide"})
        else:
            return Response({"success":False,"msg":"Technical issue! please try again"})  
    except Users.DoesNotExist:
        return Response({"success":False,"msg":"user doesn't exists"})
    except Tourist_Guide.DoesNotExist:
        return Response({"success":False,"msg":"guide doesn't exists"})
    except Exception as e:
        return Response({"success":False,"msg":f"Error occurred {e}"})

@api_view(["POST"])
def get_status(request):
    user = request.data.get("username")
    guide = request.data.get("guide")
    try:
        user_id = Users.objects.get(UserName = user).id
        guide_id = Tourist_Guide.objects.get(Guide_Username = guide).id
        status = Book_guide.objects.get(user = user_id,G_userName = guide_id).status
        if str(status) :
            return Response({"success":True,"msg":"Your Request Status","status":status})
        else:
            return Response({"success":False,"msg":f"Error occurred {e}"})
    except Users.DoesNotExist:
        return Response({"success":False,"msg":"user doesn't exists"})
    except Tourist_Guide.DoesNotExist:
        return Response({"success":False,"msg":"guide doesn't exists"})
    except Exception as e:
        return Response({"success":False,"msg":f"Error occurred {e}"})
    
@api_view(["POST"])
def guide_status(request):
    guide = request.data.get("guide_name")
    try:
        guide_obj = Tourist_Guide.objects.get(Guide_Username = guide)
        guide_obje = Book_guide.objects.filter(G_userName = guide_obj.id)
        data = []
        for booking in guide_obje:
            data.append({
                "user" : booking.user.UserName,
                "status" : booking.status,
                "id" : booking.user.id,
                "guide_id" : booking.G_userName.id,
                "from_date" : booking.from_date,
                "to_date" : booking.to_date,
                "user_number" : booking.user.User_Number,

            })
        return Response({"success":True,"msg":"Your Request Status","data":data})
    except Tourist_Guide.DoesNotExist:
        return Response({"success":False,"msg":"guide doesn't exists"})
    except Exception as e:
        return Response({"success":False,"msg":f"Error occurred {e}"})
    
@api_view(["POST"])
def accept_or_reject(request):
    acc_or_rej = request.data.get("accept_or_reject")
    guide_id = request.data.get("guide_id")
    user_id = request.data.get("user_id")

    accepted_exists = Book_guide.objects.filter(user=user_id, status=1).exists()
    if accepted_exists:
        return Response({"success": False, "msg": "User already assigned a guide"})

    book_obj = Book_guide.objects.filter(user=user_id,G_userName=guide_id,status = 0).first()
    if not book_obj:
        return Response({"success": False, "msg": "Booking not found"})

    if acc_or_rej == "accept":
        book_obj.status = 1
        book_obj.save()
        return Response({"success": True, "msg": "Request accepted"})

    elif acc_or_rej == "reject":
        book_obj.status = -1
        book_obj.save()
        return Response({"success": True, "msg": "Request rejected"})
    
    return Response({"success": False, "msg": "Invalid action"})
    
@api_view(["POST"])
def store_itinerary(request):
    user_id = request.data.get("userId")
    guide_name = request.data.get("guide_name")
    trips = request.data.get("trip")
    try:
        user = Users.objects.get(id=user_id)
        guide = Tourist_Guide.objects.get(Guide_Username=guide_name)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Tourist_Guide.DoesNotExist:
        return Response({"error": "Guide not found"}, status=404)
    
    created_trips = []
    for trip in trips:
        day_str = trip.get("Day", "Day 1 :")
        day_number = int(day_str.replace("Day", "").replace(":", "").strip())

        # Convert time string to Python time object
        time_str = trip.get("time", "00:00")
        time_obj = datetime.strptime(time_str, "%H:%M").time()

        # Trip details
        trip_detail = trip.get("trip", "")

        # Create Itinerary object
        serializer = ser_itinerary(data={
            "i_user": user.id,
            "i_guide": guide.id,
            "day": day_number,
            "time": time_obj,
            "trip_details": trip_detail
        })

        if serializer.is_valid():
            serializer.save()
            Book_guide.objects.filter(status=1,user = user_id,G_userName = guide.id).update(status = 2)
            created_trips.append(serializer.data)
        else:
            return Response({"error": serializer.errors}, status=400)
        
    return Response({
        "success": True,
        "message": "Itinerary stored successfully",
        "data": created_trips
    })

@api_view(["POST"])
def itinerary(request):
    guide_name = request.data.get("guide_name")
    try:
        guide = Tourist_Guide.objects.get(Guide_Username = guide_name)
        trips = Itinerary.objects.filter(i_guide = guide,trip_status = 0)
    except Tourist_Guide.DoesNotExist:
        return Response({"Success":False,"msg":"Guide does not found"})
    except Itinerary.DoesNotExist:
        return Response({"success":False,"msg" : "Itinerary details not found"})
    user_dict = {}
    for trip in trips:
        user_id = trip.i_user.id
        if user_id not in user_dict:
            user_dict[user_id] = {
                "user_id": user_id,
                "username": trip.i_user.UserName,
                "mobile": trip.i_user.User_Number,
                "trips": []
            }
        user_dict[user_id]["trips"].append({
            "day": trip.day,
            "time": trip.time.strftime("%H:%M"),
            "trip_details": trip.trip_details
        })

    # Convert dict to list
    user_details = list(user_dict.values())

    return Response({"success": True, "data": user_details})

@api_view(["POST"])
def past_tourist(request):
    guide_name = request.data.get("guide_name")
    try:
        guide = Tourist_Guide.objects.get(Guide_Username = guide_name)
        unique_users = (
            Itinerary.objects.filter(i_guide=guide, trip_status=1)
            .values("i_user")  # just grab user IDs
            .distinct()
        )
        users = Users.objects.filter(id__in=[u["i_user"] for u in unique_users])

        user_dict = [{"id": user.id, "name": user.UserName,"mobile" : user.User_Number,"location" : user.Location} for user in users]

        return Response({"success": True, "users": user_dict})

    except Tourist_Guide.DoesNotExist:
        return Response({"success": False, "msg": "Guide not found"})


@api_view(["POST"])
def get_guide_details(request):
    guide_user_name = request.data.get("guide_name")
    try :
        guide_obj = Tourist_Guide.objects.get(Guide_Username = guide_user_name)
        ser = ser_touristGuide(guide_obj)
        return Response({"success" : True,"msg":"user found","data" : ser.data})
    except Tourist_Guide.DoesNotExist:
        return Response({"success":False,"msg" : "Guide doesn't exists"})

@api_view(["POST"])
def get_user_details(request):
    username = request.data.get("user_name")
    try :
        user_obj = Users.objects.get(UserName = username)
        ser = ser_users(user_obj)
        return Response({"success" : True,"msg":"guide found","data" : ser.data})
    except Users.DoesNotExist:
        return Response({"success":False,"msg" : "user doesn't exists"})

@api_view(["POST"])
def update_guide_details(request):
    guide_name = request.data.get("guide_name")
    languages = request.data.get("languages")
    experience = request.data.get("experience")
    full_name = request.data.get("full_name")
    mobile_number = request.data.get("phone_number")
    profile_photo = request.FILES.get("profile_photo")  
    
    try:
        guide = Tourist_Guide.objects.get(Guide_Username=guide_name)
    except Tourist_Guide.DoesNotExist:
        return Response({"success": False, "msg": "Guide not found"})

    # Update fields
    if languages: guide.Guide_Languages_know = languages
    if experience: guide.Guide_experience = experience
    if full_name: guide.Guide_FullName = full_name
    if mobile_number: guide.Guide_Number = mobile_number
    if profile_photo: guide.Guide_Image = profile_photo  # ✅ store file

    guide.save()

    return Response({"success": True, "msg": "Profile updated successfully"})

@api_view(["POST"])
def update_user_details(request):
    user_name = request.data.get("user_name")
    languages = request.data.get("languages")
    full_name = request.data.get("full_name")
    mobile_number = request.data.get("phone_number")
    location = request.data.get("Location")
    profile_photo = request.FILES.get("profile_photo")  
    
    try:
        user = Users.objects.get(UserName=user_name)
    except Users.DoesNotExist:
        return Response({"success": False, "msg": "Guide not found"})

    # Update fields
    if languages: user.User_Languages_Know = languages
    if full_name: user.User_fullName = full_name
    if location : user.Location = location
    if mobile_number: user.User_Number = mobile_number
    if profile_photo: user.User_profile_photo = profile_photo  # ✅ store file

    user.save()

    return Response({"success": True, "msg": "Profile updated successfully"})


@api_view(["POST"])
def get_itinerary(request,id):
    user_id = id
    guide_name = request.data.get("guide_name")
    try:
        guide_obj = Tourist_Guide.objects.get(Guide_Username = guide_name)
    except Tourist_Guide.DoesNotExist:
        return Response({"success":False,"msg":"Guide not found"}) 
    except Exception as e:
        return Response({"success":False,"msg":f"Error occured {e}"})
    iti_obj = Itinerary.objects.filter(i_user = user_id,i_guide = guide_obj.id)
    if not iti_obj.exists():
        return Response({"success":False,"msg":"Itinerary not created"})
    ser = ser_itinerary(iti_obj,many = True)
    return Response({"success":True,"data":ser.data,"msg":"Itinerary found"})

@api_view(["POST"])
def get_itinerary_for_user(request):
    user_name = request.data.get("user_name")
    try:
        user_obj = Users.objects.get(UserName = user_name)
    except Users.DoesNotExist:
        return Response({"success":False,"msg":"User not found"}) 
    except Exception as e:
        return Response({"success":False,"msg":f"Error occured {e}"})
    iti_obj = Itinerary.objects.filter(i_user = user_obj.id,trip_status = 0)
    first_iti = iti_obj.first()
    guide_name = first_iti.i_guide.Guide_Username
    if not iti_obj.exists():
        return Response({"success":False,"msg":"Itinerary not created"})
    ser = ser_itinerary(iti_obj,many = True)
    return Response({"success":True,"data":ser.data,"msg":"Itinerary found","guide_name" : guide_name})

@api_view(["POST"])
def updating_itinerary(request):
    trip_id = request.data.get("trip_id")
    try:
        trip_obj = Itinerary.objects.get(id = trip_id)
        trip_obj.time_status = 1
        trip_obj.save()
        return Response({"success":True,"msg" : "Trip updated"})
    except Itinerary.DoesNotExist:
        return Response({"success":False,"msg" : "Trip does not found"})
    
@api_view(["POST"])
def update_complete_itinerary(request):
    user_name = request.data.get("user_name")
    try:
        user_obj = Users.objects.get(UserName = user_name)
        iti_obj = Itinerary.objects.filter(i_user = user_obj.id,trip_status = 0)
        for iti in iti_obj:
            iti.trip_status = 1
            iti.save()
        return Response({"success":True,"msg" : "Successfully Completed Itinerary"})
    except Users.DoesNotExist:
        return Response({"success":False,"msg" : "User Does not found"})
    except Itinerary.DoesNotExist:
        return Response({"success":False,"msg" : "Itinerary Does not found"})

def delete_all_data(request):
    """
    Deletes all data from selected models.
    Triggered via a POST request.
    """
    try:
        # Delete all records
        # Users.objects.all().delete()
        Itinerary.objects.all().delete()
        # Tourist_Guide.objects.all().delete()
        # Book_guide.objects.all().delete()

        return HttpResponse("All data deleted successfully!", status=200)

    except Exception as e:
        return HttpResponse(f"Error occurred: {str(e)}", status=500)

def all_users_and_guides(request):
    users = Users.objects.all()
    guides = Tourist_Guide.objects.all()
    context = {
        "users": users,
        "guides": guides
    }
    return render(request, "all_data.html", context)
# Create your views here.
