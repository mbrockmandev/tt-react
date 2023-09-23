const userFaqs: { question: string, answer: string }[] = [
  {
    question: "How can I search for a book?",
    answer: "Navigate to the search bar on the main page, enter the title," +
      " author, or ISBN of the book you're looking for, and press enter."
  },
  {
    question: "How do I borrow a book?",
    answer: "Once you've found the book you'd like to borrow, click on it for more details and then select the 'Borrow' button."
  },
  {
    question: "How can I return a book?",
    answer: "Go to your user dashboard, under 'Borrowed Books', select the" +
      " book you want to return, and click 'Return' on the details page."
  },
  {
    question: "Can I browse all available titles?",
    answer: "Yes, you can browse all available titles across multiple" +
      " libraries on our platform. Just navigate to the 'Books' navigation" +
      " item."
  },
  {
    question: "How do I switch between active libraries?",
    answer: "First click on the 'Libraries' navigation item, then select" +
      " the library you want to view, and select 'Set as my library' to set" +
      " this as your current library."
  },
  {
    question: "I'm having trouble logging in, what should I do?",
    answer: "Ensure you've entered the correct credentials. If you've" +
      " forgotten your password, or the problem persists, contact support."
  },
  {
    question: "What happens if I stay inactive for too long?",
    answer: "For security reasons, your session will time out after 15 minutes of inactivity. You will need to log in again to continue using the platform."
  },
  {
    question: "How secure is my data?",
    answer: "We use JWT authentication to protect all sensitive routes and" +
      " ensure that your data remains private and secure."
  }
];
const staffFaqs = [
  {
    question: "How can I view user information?",
    answer: "Navigate to the 'Users' section in your dashboard. You can view" +
      " user details, but remember you only have permission to look up and" +
      " update details. Please contact an administrator if you need to" +
      " manually create or delete a user."
  },
  {
    question: "How can I update book or library details?",
    answer: "Navigate to the 'Books' or 'Libraries' section in your" +
      " dashboard, and click on the 'Update' button for the book or library" +
      " you want to update."
  },
  {
    question: "Why can't I create or delete books, users, or libraries?",
    answer: "Staff members are restricted from creating or deleting to" +
      " ensure data integrity. However, you can update details as needed." +
      " Please contact an administrator if you need to manually create or " +
      " delete a user or library."
  },
  {
    question: "How do I run basic reports?",
    answer: "Go to the 'Reports' section in your dashboard, select the type of report you want to generate, and follow the prompts."
  },
  {
    question: "Can I browse books and libraries like regular users?",
    answer: "Absolutely! You can browse all available titles and libraries just like regular users."
  }
];

const adminFaqs = [
  {
    question: "How can I create a new book/user/library?",
    answer: "Navigate to the respective section (Books/Users/Libraries) in" +
      " your dashboard and click on the 'Create' button. Fill in the required" +
      " details and save."
  },
  {
    question: "How do I delete a book/user/library?",
    answer: "Use the 'Delete' button under each section in your dashboard. "
  },
  {
    question: "Are there any restrictions on my account?",
    answer: "No, as an Admin, you have global access, which means you can create, read, update, and delete any books, users, or libraries."
  },
  {
    question: "How do I manage user roles?",
    answer: "Under the 'Users' section, click on a specific user. There, you can assign or modify their role as needed."
  },
  {
    question: "What's the best way to get an overview of the platform's data?",
    answer: "Navigate to the 'Reports' section. As an Admin, you have access to comprehensive reports that will provide insights into user behaviors, book borrowings, and more."
  }
];

export {userFaqs, staffFaqs, adminFaqs};