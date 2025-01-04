import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const helpMarkdownContent = `In the **Connections** section, you can explore and manage your connected users through different views. Each view offers a unique perspective to help you organize and interact with your connections effectively. Below is an explanation of each view:

---

#### **1. Smart Sort (Default View)**  


The **Smart Sort** view intelligently organizes your connections into three tiers to help you prioritize interactions:

- **First Tier:**  
  Connections who are mutual and are already marked as "Known+" (you have explicitly recognized them as known). These are shown **most recent first**, helping you quickly see updates from your closest connections.  

- **Second Tier:**  
  Connections who are already marked as "Known+" but aren’t mutual. These are also sorted **most recent first**.  

- **Third Tier:**  
  All remaining connections that don’t fall into the first or second tier. These are shown **most recent first**, allowing you to review updates from other connections.

---

#### **2. Expected Connections (Default Option)**  
The **Expected Connections** view highlights users who you might interact with most often:

- **First Tier:**  
  Connections who are both mutual and marked as "Known+". These are shown **most recent first**.  

- **Second Tier:**  
  All other connections not included in the first tier. These are also sorted **most recent first**.  

This view provides a streamlined approach to focus on the most likely interactions.

---

#### **3. Their Recovery**  
This view displays **connections who you selected as your recovery contacts**. These individuals have been entrusted to help recover your account if necessary.  

- Connections in this view are sorted **most recent first**, so you can easily review recent interactions or changes.

---

#### **4. Recovery**  
This view lists **connections who selected you as their recovery contact**. Being someone’s recovery contact is an important responsibility, and this view ensures you can see and manage those relationships clearly.  

- Connections are shown **most recent first**, keeping the most recent selections at the top.

---

#### **5. Already Known+**  
This view displays all the connections you have explicitly marked as "Known+".  

- These connections are sorted **most recent first**, making it easy to stay updated with their latest activity.

---

### **How to Use These Views**
- Use the **Smart Sort** and **Expected Connections** views to prioritize interactions and stay connected with important users.
- Check the **Their Recovery** and **Recovery** views to manage recovery relationships effectively.
- Utilize the **Already Known+** view to quickly access trusted connections.
`;

export default function SubjectConnectionsHelpBody() {
  return (
    <div className="leading-loose no-scrollbar text-base max-h-96 overflow-y-auto">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold text-blue-600" {...props} />
          ),
          hr: ({ node, ...props }) => <hr className="my-5" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-blue-500 hover:underline" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mt-5" {...props}></p>,
        }}
        remarkPlugins={[remarkGfm]}
      >
        {helpMarkdownContent}
      </ReactMarkdown>
    </div>
  );
}
