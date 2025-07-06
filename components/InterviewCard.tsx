import dayjs from "dayjs";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechstacks from "./DisplayTechstacks";
import { getRandomInterviewCover } from "@/lib/utils";
const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback = null as Feedback | null;
  const normalisedType = /mix/gi.test(type) ? "Mixed" : type;
  const date = dayjs(feedback?.createdAt || createdAt || Date.now()).format(
    "MMM D,YYYY"
  );

  return (
    <div className="card-border w-[360px] max-sw:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-800">
            <p className="badge-text">{normalisedType}</p>
          </div>
          <Image
            src={getRandomInterviewCover()}
            alt="cover"
            width={80}
            height={80}
            className="rounded-full object-fit size-[80px]"
          />
          <h3 className="capitalize mt-5">{role} Interview</h3>
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src={"/calendar.svg"}
                alt="calendar"
                width={20}
                height={20}
              />
              <p>{date}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Image src={"/star.svg"} alt="star" width={22} height={22} />
              <p> {feedback?.totalScore || "---"}/100</p>
            </div>
          </div>
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now"}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <DisplayTechstacks techStack={techstack} />
          <Button className="btn-primary">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "View Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
