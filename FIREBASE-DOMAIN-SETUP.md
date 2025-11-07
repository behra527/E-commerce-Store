# 🔥 Firebase Domain Setup Guide - Fix "Unauthorized Domain" Error

## 🚨 **Problem: "This domain is not authorized for Google login"**

Ye error isliye aa raha hai kyunki aapka Hostinger domain Firebase Console mein authorized nahi hai.

## ✅ **Solution: Domain ko Firebase mein authorize karein**

### **Step 1: Firebase Console pe jao**
1. Browser mein ye URL open karein: **https://console.firebase.google.com/**
2. Apne Google account se login karein

### **Step 2: Project select karein**
1. **dexter-e4919** project pe click karein
2. Project dashboard open hoga

### **Step 3: Authentication section mein jao**
1. Left sidebar mein **Authentication** pe click karein
2. **Settings** tab pe click karein
3. Page ke bottom tak scroll karein

### **Step 4: Authorized domains section**
1. **Authorized domains** section dhundhein
2. **Add domain** button pe click karein
3. Apna Hostinger domain add karein

### **Step 5: Domain add karein**
1. Text box mein apna domain type karein:
   - `yourdomain.com` (without www)
   - `www.yourdomain.com` (with www)
2. **Add domain** button pe click karein
3. **5-10 minutes wait** karein (changes propagate hone mein time lagta hai)

## 📋 **Example Domain Formats**

```
✅ Correct formats:
- example.com
- www.example.com
- shop.example.com
- app.example.com

❌ Wrong formats:
- https://example.com
- http://example.com
- example.com/
- example.com/page
```

## 🔍 **Current Authorized Domains**

Aapke project mein ye domains already authorized hain:
- `dexter-e4919.firebaseapp.com` (Firebase default)
- `localhost` (development)

## ⏰ **Timeline**

1. **Domain add karne ke baad**: 5-10 minutes wait
2. **Testing**: Domain add karne ke baad test karein
3. **Cache clear**: Browser cache clear karein

## 🧪 **Testing After Setup**

1. **Browser cache clear** karein
2. **Google Sign-In** try karein
3. **Console errors** check karein
4. **Success message** dekhne ko milega

## 🆘 **If Still Not Working**

### **Check these things:**
1. ✅ Domain correctly add hua hai?
2. ✅ 10 minutes wait kiya hai?
3. ✅ Browser cache clear kiya hai?
4. ✅ Different browser mein test kiya hai?

### **Common mistakes:**
- Domain mein `https://` ya `http://` add kar diya
- Domain ke end mein `/` add kar diya
- Wrong domain add kiya

## 📱 **Mobile Testing**

1. **Mobile browser** mein test karein
2. **Incognito mode** mein test karein
3. **Different device** pe test karein

## 🔒 **Security Note**

- Domain add karne ke baad automatically secure ho jata hai
- Koi bhi unauthorized domain se login nahi kar sakta
- Ye one-time setup hai, baar baar karne ki zarurat nahi

---

**Remember**: Domain add karne ke baad 5-10 minutes wait karna zaruri hai! 🕐

