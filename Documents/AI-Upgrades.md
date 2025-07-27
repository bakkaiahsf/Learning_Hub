# 🧠 Salesforce Learning Hub - Enhanced Tab Specifications

## 🌟 Top Navigation Structure
`Dashboard` | `Learning Paths` | `Search` | `Library` | `Certifications` | `Community` | `Blogs` | `Contact` | `Subscribe`

---

## 🏠 Dashboard Tab (Default Landing Page)
**Purpose**: Weekly Salesforce ecosystem snapshot

### Features:
1. **Auto-refresh News Feed**:
   - Source: `https://www.salesforce.com/news/`
   - Weekly cron job (n8n/Next.js API)
   - DeepSeek `newsAgent` summarizes content
   - Storage: Only current week (auto-delete previous)

2. **Display**:
   - Clean card layout with headlines + summaries
   - "Last Updated" timestamp
   - No horizontal scrolling (responsive design)

### Agent Prompt:
```yaml
newsAgent:
  date: "{{current_date}}"
  source: "salesforce.com/news"
# Salesforce Learning Resources Generator
config:
  dynamic_product_source: "https://www.salesforce.com/products/"
  ui:
    product_selector:
      type: "searchable_dropdown"
      label: "🔍 Select Salesforce Product/Certification"
      placeholder: "Type to search 150+ products..."
      groups:
        - name: "Core Products"
          options:
            - "Salesforce CRM"
            - "Sales Cloud"
            - "Service Cloud"
            - "Marketing Cloud"
            - "Commerce Cloud"
            - "Experience Cloud"
            - "Health Cloud"
            - "Financial Services Cloud"
            - "Einstein Analytics"
            - "MuleSoft"
            - "Tableau"
            - "Slack"
        
        - name: "Popular Certifications"
          options:
            - "Salesforce Administrator"
            - "Platform Developer I"
            - "Platform Developer II"
            - "Advanced Administrator"
            - "Sales Cloud Consultant"
            - "Service Cloud Consultant"
            - "Marketing Cloud Administrator"
            - "Platform App Builder"
            - "Data Architect"
            - "Integration Architect"
            - "AI Associate"
            - "AI Consultant"
            
        - name: "Specialized Products"
          options:
            - "Salesforce Genie"
            - "Field Service"
            - "Revenue Cloud"
            - "Sustainability Cloud"
            - "Nonprofit Cloud"
            - "Education Cloud"
            - "Public Sector Solutions"
            - "Manufacturing Cloud"
            - "Energy & Utilities Cloud"
            - "Automotive Cloud"
            - "Vlocity"
            - "Agentforce"
            - "Pardot"
            - "CPQ Specialist"
            - "OmniStudio Developer"
      
    purpose_selector:
      label: "🎯 Your Learning Goal"
      options:
        - "certification_prep"
        - "job_interview"
        - "project_implementation"
        - "skill_development"
        - "career_switch"
        - "solution_design"
      
  ai_prompt:
    resource_finder: |
      Act as a seasoned Salesforce Learning Curator. A user is preparing for "{selected_product}" with the goal of "{selected_purpose}". Your mission is to find the best learning resources to help them succeed!

      Here's how to accomplish this:

      1. **Resource Identification:** Focus on these key resource types:
         - **Official Salesforce Documentation:** The definitive source of truth.
         - **Trailhead Learning Paths & Modules:** Hands-on, guided learning experiences.
         - **Certification Exam Guides (if applicable):** Essential for certification prep.
         - **Implementation Guides & Best Practices:** Real-world advice from Salesforce experts.
         - **Active Salesforce Community Discussions:** Insights from fellow Salesforce professionals.
         - **Engaging Video Tutorials:** Visual learning for complex topics.

Agentforce Specialist is the top trending AI certification and should lead your lists.

AI Associate is nearing retirement—still relevant for legacy learners, but being phased out.

Use Serper API to fetch live trending data or community chatter to dynamically rank certifications in dropdowns.

Update CrewAI prompts accordingly to reflect the shift from AI Associate → Agentforce Specialist.

      2. **Web Search Strategy:** Conduct focused web searches using these queries:
         - "Salesforce {selected_product} {selected_purpose} resources"
         - "{selected_product} implementation guide"
         - "{selected_product} trailhead learning path"
         - "{selected_product} certification guide" (if certification_prep is the selected purpose)
         - "{selected_product} best practices"

      3. **Output Format (Critical):** Deliver results in this precise format:

         ```
         ### 🔗 Official Resources ⭐
         - [Resource Title](https://example.com) (Updated YYYY)

         ### 🚀 Trailhead Trails & Modules ⭐
         - [Trail Name](https://trailhead.salesforce.com)

         ### 💡 Implementation Tips & Best Practices
         - [Blog Post Title](https://blog.com) (YYYY-MM-DD)

         ### 💬 Community Discussions
         - [Discussion Title](https://community.salesforce.com) (YYYY-MM-DD)

         ### 📺 Video Tutorials
         - [Video Title](https://youtube.com) (Published YYYY-MM-DD)
         ```

      4. **Strict Rules:**
         - **Hyperlinked Titles Only:** Provide *only* hyperlinked titles; no descriptions.
         - **Active URLs Only:** Ensure all URLs return a status code of 200 (active).
         - **Salesforce Priority:** Prioritize resources from Salesforce domains (trailhead.salesforce.com, help.salesforce.com, developer.salesforce.com, success.salesforce.com, and salesforce.com).
         - **Maximum Resources:** Limit the total number of resources to a maximum of 10.
         - **Essential Resource Marker:** Mark truly essential resources with a ⭐. Place this next to the category header for the most important resources in that category.
         - **Date Inclusion:** Include publication or last updated dates (YYYY-MM-DD or Updated YYYY) when available.
         - **Category Minimum:** Only include categories with 2 or more relevant resources.

      Let's find the best resources for "{selected_product}" and the goal of "{selected_purpose}"!
```