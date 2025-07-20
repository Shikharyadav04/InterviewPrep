import { getCurrentUser } from "@/lib/action/auth.action";
import {
  getInterview,
  getInterviewsByUserId,
} from "@/lib/action/general.action";
import { getRandomInterviewCover } from "@/lib/utils";
import { redirect } from "next/navigation";
import DisplayTechstacks from "@/components/DisplayTechstacks";
import Image from "next/image";
import Agent from "@/components/Agent";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterview(id);
  if (!interview) redirect("/");

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechstacks techStack={interview.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>
      <Agent
        userName={user?.name ?? ""}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
      />
    </>
  );
};

export default InterviewDetails;
