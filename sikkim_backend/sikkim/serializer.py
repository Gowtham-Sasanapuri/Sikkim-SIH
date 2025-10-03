from .models import Users,Tourist_Guide,Book_guide,Itinerary
from rest_framework import serializers

class ser_users(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'

class ser_touristGuide(serializers.ModelSerializer):
    class Meta:
        model = Tourist_Guide
        fields = '__all__'

class ser_book_guide(serializers.ModelSerializer):
    class Meta:
        model = Book_guide
        fields = '__all__'

class ser_itinerary(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = '__all__'