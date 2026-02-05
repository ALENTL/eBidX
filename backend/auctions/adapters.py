from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(self, request, sociallogin):
        if (
            request
            and hasattr(request, "data")
            and request.data.get("process") == "register"
        ):
            return True
        return False
