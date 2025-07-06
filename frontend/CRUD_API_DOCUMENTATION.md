# Email Automation System - CRUD API Documentation

## ✅ **COMPLETE CRUD FUNCTIONALITY AVAILABLE**

The email automation system provides full CRUD (Create, Read, Update, Delete) operations for all major entities.

## 📧 **CAMPAIGNS CRUD**

### **CREATE Campaign**
```bash
POST /api/email/campaigns
```
**Request Body:**
```json
{
  "name": "Holiday Campaign 2024",
  "description": "Special holiday promotions",
  "type": "PROMOTIONAL",
  "subject": "🎄 Holiday Special - 50% Off Everything!",
  "fromName": "Agent CEO Team",
  "fromEmail": "promotions@agentceo.com",
  "replyTo": "support@agentceo.com",
  "htmlContent": "<html><body>Holiday content...</body></html>",
  "textContent": "Holiday text content",
  "targetLists": ["list_001", "list_002"],
  "schedulingType": "SCHEDULED",
  "scheduledTime": "2024-12-15T10:00:00Z",
  "priority": "HIGH",
  "tags": ["holiday", "promotion", "seasonal"]
}
```

### **READ Campaigns**
```bash
# Get all campaigns with filtering
GET /api/email/campaigns?status=ACTIVE&type=NEWSLETTER&page=1&limit=10

# Get single campaign (Server Action)
getEmailCampaign(campaignId)
```

### **UPDATE Campaign**
```bash
# Update campaign status
updateCampaignStatus(campaignId, "PAUSED")

# Full campaign update
updateEmailCampaign(campaignId, {
  "name": "Updated Campaign Name",
  "subject": "Updated Subject Line",
  "scheduledTime": "2024-12-20T10:00:00Z"
})
```

### **DELETE Campaign**
```bash
deleteEmailCampaign(campaignId)
```

### **BONUS Operations**
```bash
# Duplicate campaign
duplicateEmailCampaign(campaignId, "Copy of Holiday Campaign")
```

---

## 📄 **TEMPLATES CRUD**

### **CREATE Template**
```bash
POST /api/email/templates
```
**Request Body:**
```json
{
  "name": "Holiday Newsletter Template",
  "description": "Festive newsletter template for holidays",
  "type": "NEWSLETTER",
  "category": "MARKETING",
  "htmlContent": "<html><head><style>...</style></head><body>...</body></html>",
  "textContent": "Text version of template",
  "cssStyles": ".header { background: #ff0000; }",
  "variables": {
    "headerImage": "string",
    "companyName": "string",
    "customMessage": "string"
  },
  "tags": ["holiday", "newsletter", "festive"]
}
```

### **READ Templates**
```bash
# Get all templates
GET /api/email/templates?category=MARKETING&type=NEWSLETTER

# Get single template
getEmailTemplate(templateId)
```

### **UPDATE Template**
```bash
updateEmailTemplate(templateId, {
  "name": "Updated Template Name",
  "htmlContent": "<html>Updated content...</html>",
  "variables": { "newField": "string" }
})
```

### **DELETE Template**
```bash
deleteEmailTemplate(templateId)
```

---

## 👥 **CONTACT LISTS CRUD**

### **CREATE Contact List**
```bash
POST /api/email/lists
```
**Request Body:**
```json
{
  "name": "Holiday Subscribers",
  "description": "Customers interested in holiday promotions",
  "type": "MARKETING",
  "source": "WEB_FORM",
  "tags": ["holiday", "subscribers", "active"],
  "customFields": {
    "preferences": "object",
    "segments": "array"
  }
}
```

### **READ Contact Lists**
```bash
# Get all lists
GET /api/email/lists?type=MARKETING&page=1&limit=10

# Get single list
getContactList(listId)
```

### **UPDATE Contact List**
```bash
updateContactList(listId, {
  "name": "Updated List Name",
  "description": "Updated description",
  "tags": ["updated", "tags"]
})
```

### **DELETE Contact List**
```bash
deleteContactList(listId)
```

### **BONUS Operations**
```bash
# Import contacts to list
importContacts({
  "listId": "list_001",
  "contacts": [
    {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "company": "Example Corp"
    }
  ],
  "deduplicationSettings": {
    "mergeStrategy": "UPDATE_EXISTING",
    "keyFields": ["email"]
  }
})
```

---

## 📊 **ANALYTICS CRUD**

### **READ Analytics**
```bash
# Campaign analytics
GET /api/email/analytics?type=campaign&campaignId=camp_001&timeframe=30d

# Overview analytics
GET /api/email/analytics?type=overview&workspaceId=workspace_001
```

---

## 🔒 **Authentication & Permissions**

All CRUD operations require:
- ✅ Valid user session (`auth()`)
- ✅ Proper workspace permissions
- ✅ Input validation and sanitization
- ✅ Error handling with proper HTTP status codes

## 🧪 **Testing CRUD Operations**

### **Example Test Sequence:**

```javascript
// 1. CREATE a campaign
const createResponse = await fetch('/api/email/campaigns', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Test Campaign",
    type: "NEWSLETTER",
    subject: "Test Subject",
    fromName: "Test Team",
    fromEmail: "test@example.com"
  })
})
const { campaign } = await createResponse.json()

// 2. READ the campaign
const readResponse = await getEmailCampaign(campaign.id)

// 3. UPDATE the campaign
const updateResponse = await updateEmailCampaign(campaign.id, {
  name: "Updated Test Campaign"
})

// 4. DELETE the campaign
const deleteResponse = await deleteEmailCampaign(campaign.id)
```

## 🎯 **Validation Features**

- ✅ **Email Format Validation**: RFC-compliant email validation
- ✅ **Type Validation**: Enum validation for campaign types, template categories
- ✅ **Schedule Validation**: Future date validation for scheduled campaigns
- ✅ **Permission Checks**: User/workspace authorization
- ✅ **Dependency Checks**: Prevents deletion of resources in use
- ✅ **Data Sanitization**: Input cleaning and XSS prevention

## 🚀 **Advanced Features**

- ✅ **Pagination**: All list endpoints support pagination
- ✅ **Filtering**: Status, type, date range filtering
- ✅ **Search**: Full-text search capabilities
- ✅ **Bulk Operations**: Import/export functionality
- ✅ **Audit Trail**: Creation/update timestamps
- ✅ **Soft Deletes**: Recoverable deletion options
- ✅ **Versioning**: Template versioning support

---

## 📋 **Summary**

**The email automation system provides COMPLETE CRUD functionality for:**

| Entity | Create | Read | Update | Delete | Bonus |
|--------|--------|------|--------|--------|-------|
| Campaigns | ✅ | ✅ | ✅ | ✅ | Duplicate, Status Updates |
| Templates | ✅ | ✅ | ✅ | ✅ | Versioning |
| Contact Lists | ✅ | ✅ | ✅ | ✅ | Import/Export |
| Analytics | N/A | ✅ | N/A | N/A | Time-series, Reporting |

**Total: 100% CRUD Coverage** ✅ 