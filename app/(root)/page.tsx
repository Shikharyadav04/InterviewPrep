import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import {
  getInterviewsByUserId,
  getOtherInterviews,
} from "@/lib/action/general.action";
import { getCurrentUser } from "@/lib/action/auth.action";
const page = async () => {
  const user = await getCurrentUser();
  const [userInterviews, otherInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getOtherInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length ?? 0 > 0;
  const hasOtherInterviews = otherInterviews?.length ?? 0 > 0;
  // console.log(userInterviews);
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Prepare best for your Interviews with AI</h2>
          <p className="text-lg">
            Practice on real interview questions and get feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href={"/interview"}>Start an Interview </Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          width={400}
          height={400}
          alt="robot"
          className="max-sm:hidden"
        />
      </section>
      <section className="flex flex-col gap-6 mt-8 ">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {/*  */}
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>No interviews found</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8 ">
        <h2>Take an interview</h2>

        <div className="interviews-section">
          {/* <p>no interview</p> */}
          {hasOtherInterviews ? (
            otherInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>No Interviews Found</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
