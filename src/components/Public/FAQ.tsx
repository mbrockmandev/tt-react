import React, {useEffect, useState} from 'react';
import {userAtom} from "../../recoil/atoms/userAtom";
import {useRecoilValue} from "recoil";
import {adminFaqs, staffFaqs, userFaqs} from "../../utils/qa";

const FAQ: React.FC = () => {
  const user = useRecoilValue(userAtom);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    if (user.role === "admin") {
      setFaqs(adminFaqs);
    } else if (user.role === "user") {
      setFaqs(userFaqs);
    } else if (user.role === "staff") {
      setFaqs(staffFaqs);
    }
  }, []);

  return (
    <>
      <h2 className="m-4 text-2xl font-semibold text-gray-700">FAQs
        for {user.role}</h2>
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="p-4">
            <h3
              className="text-xl font-bold text-gray-800 mb-2">{faq.question}</h3>
            <p
              className="text-md text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </>
  );

};

export default FAQ;