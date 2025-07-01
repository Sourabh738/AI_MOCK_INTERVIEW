import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";

import {getCurrentUser} from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async() => {
  const user = await getCurrentUser();

    if (!user?.id) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Please sign in to view your interviews.</p>
      </div>
    );
  }

   const [userInterviews, latestInterviews] = await Promise.all([
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          await getInterviewsByUserId(user?.id!),
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          await getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = (userInterviews ?? []).length>0;
  const hasUpcomingInterviews = (latestInterviews ?? []).length > 0;




  return (
    <>

      <section className="card-cta">
          <div className="flex flex-col gap-6 max-w-lg">
              <h2>Get interview-Ready with AI-Powered Practice & Feedback</h2>
                <p className="text-lg">
                  Practice on real interview questions & get instant feedback
                </p>

                <Button asChild className="btn-primary max-sm-w-full">
                    <Link href="/interview">Start an Interview </Link>
                </Button>

          </div>
          <Image src="/robot.png" alt="robo-dude" width={400} height={400} className="max-sm:hidden"/>
      </section>
       
       <section className="flex flex-col gap-6 mt-8">
          <h2>Your Past Interviews</h2>

          <div className="Interviews-section  flex flex-wrap gap-6">
            {
              hasPastInterviews ? (
                userInterviews?.map((interview) => (
                  <InterviewCard {...interview} key={interview.id}/>
                ))) : (
                    <p>You haven&apos;t taken any interviews yet</p>
                )
              
            }

             
          </div>
       </section>

        <section className="flex flex-col gap-6 mt-8">
          <h2>Pick Your Interview</h2>

          <div className="Interviews-section">
             
          <div className="Interviews-section  flex flex-wrap gap-6">
              {
              hasUpcomingInterviews ? (
                latestInterviews?.map((interview) => (
                  <InterviewCard {...interview} key={interview.id}/>
                ))) : (
                    <p>There are no new interviews available </p>
                )
              
            }
          </div>
          </div>
       </section> 
    </>
  )
}

export default Page