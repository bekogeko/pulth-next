"use client";
import {useEffect, useState} from "react";
import posthog from "posthog-js";
import {Button} from "@/components/ui/button";

export function ConsentBanner() {
    const [consentGiven, setConsentGiven] = useState('');

    useEffect(() => {
        // We want this to only run once the client loads
        // or else it causes a hydration error
        setConsentGiven(posthog.get_explicit_consent_status());
    }, []);

    const handleAcceptCookies = () => {
        posthog.opt_in_capturing();
        setConsentGiven('granted');
    };

    const handleDeclineCookies = () => {
        posthog.opt_out_capturing();
        setConsentGiven('denied');
    };

    return (
        <div>
            {consentGiven === 'pending' && (
                <div className="fixed bottom-0 bg-accent p-2 ">
                    <p className="text-center text-white text-xl my-2">
                        We use tracking cookies to understand how you use
                        the product and help us improve it.
                        Please accept cookies to help us improve.
                    </p>
                    <Button type="button" variant={"default"} onClick={handleAcceptCookies}>Accept cookies</Button>
                    <span> </span>
                    <Button type="button" variant={"destructive"} onClick={handleDeclineCookies}>Decline
                        cookies</Button>
                </div>
            )}
        </div>
    );
}