
'use client';

import { useState } from "react"
import { useTranslations } from "next-intl"

function FormContect() {
    const t = useTranslations('Forms');
    const common = useTranslations('Common');

    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState("");

    const [contect, setContext] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    function handleChange(e){
        const {name, value} = e.target;

        setContext({
            ...contect, [name] : value,
        });
    }

    async function handleSubmit(e){
        e.preventDefault();

        setSubmitting(true);
        setFeedback("");
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contect),
            });
            const payload = await response.json();
            if (!response.ok) throw new Error(payload.error || "Unable to send your message.");
            setContext({ fullName: "", email: "", phone: "", subject: "", message: "" });
            setFeedback("Your message was sent successfully.");
        } catch (error) {
            setFeedback(error.message);
        } finally {
            setSubmitting(false);
        }

    }

  return (
    <div className="w-full min-w-0">
        <form onSubmit={handleSubmit} className="mx-auto mt-6 h-fit w-full max-w-xl rounded-lg border bg-white p-5 lg:mt-0">

                
                <h3 className="text-2xl flex justify-center mb-4">{t('contact')}</h3>
                <div className="mb-2">
                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-heading ">{t('fullName')}</label>
                    <input type="text" name="fullName" value={contect.fullName} onChange={handleChange} id="password-alternative"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm  focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body"
                    placeholder="Full name" required="" />
                </div>

                <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                    <div className="min-w-0 flex-1">
                        <label htmlFor="password-alternative" className="block mb-2 text-sm font-medium text-heading ">{t('email')}</label>
                        <input type="email" name="email" value={contect.email} onChange={handleChange} className="border py-2.5 px-3 rounded-sm w-full" placeholder="Email" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <label htmlFor="password-alternative" className="block mb-2 text-sm font-medium text-heading ">{t('phone')}</label>
                        <input type="number" pattern="[0-9]{10}" name="phone" value={contect.phone} onChange={handleChange} className="border py-2.5 px-3 rounded-sm  w-full" placeholder="Phone number" />
                    </div>
                </div>


                <div className="mb-3">
                    <label htmlFor="Phone number" className="block mb-2 text-sm font-medium text-heading ">{t('subject')}</label>
                    <input type="text" id="password-alternative" name="subject" value={contect.subject} onChange={handleChange}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm  focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body"
                    placeholder="Subject" required="" />
                </div>

                <div className="mb-5">
                    <label htmlFor="Phone number" className="block mb-2 text-sm font-medium text-heading ">{t('message')}</label>
                    <input type="text" id="password-alternative" name="message" value={contect.message} onChange={handleChange}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm  focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body"
                    placeholder="Message" required="" />
                </div>


                {feedback && <p className="mb-3 text-sm" role="status">{feedback}</p>}

                <button type="submit" disabled={submitting}
                    className="text-white bg-primary-Blue w-full rounded-md hover:scale-105 mb-3 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >{submitting ? t('sending') : common('submit')}
                </button>
            </form>
    </div>
  )
}

export default FormContect
