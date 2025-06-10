"use client";

import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import Footer from "@/app/components/footer";
import { MonthlyRefs } from "./components/monthly-refs";
import { RefVotingPowerTurnout } from "./components/ref-voting-power-turnout";
import { VotingPowerInequality } from "./components/voting-power-inequality";
import { getDriver } from "@/lib/driverStore";
import { useEffect } from "react";
import { ErroneousRate } from "./components/erroneous-rate";
import { VoterTurnoutCategory } from "./components/voter-turnout-category";
import { CapitalAllocationCategory } from "./components/capital-allocation-category";
import ProposalTrendCategory from "./components/proposal-trend-category";
import ApprovalRateCategory from "./components/approval-rate-category";
import ApprovalAmountCategory from "./components/approval-amount-category";
import TreasuryOutflow from "./components/treasury-outflow";
import AddressInfo from "./components/address-info";
import DataCard from "./components/data-card";
import {
  useApprovalAmountCategory,
  useApprovalRateCategory,
  useCapitalAllocationCategory,
  useErroneousRate,
  useMonthlyRefs,
  useProposalTrendCategory,
  useRefVotingPowerTurnout,
  useTreasuryOutflow,
  useVoterTurnoutCategory,
  useVotingPowerInequality,
} from "@/hooks/useOpenGovQueries";

export default function OpenVis() {
  // Initialize the driver in useEffect to ensure it runs only on the client
  useEffect(() => {
    // Initialize the singleton driver
    getDriver()
      .then(() => {
        console.log("Driver initialized in page component");
      })
      .catch((error) => {
        console.error("Failed to initialize driver:", error);
      });
  }, []);

  const {
    data: refData = [],
    isLoading: isMonthlyRefsLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: monthlyRefsError,
  } = useMonthlyRefs();

  const {
    data: refVotingPowerTurnoutData = [],
    isLoading: isRefVotingPowerTurnoutLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: refVotingPowerTurnoutError,
  } = useRefVotingPowerTurnout();

  const {
    data: votingPowerInequalityData = [],
    isLoading: isVotingPowerInequalityLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: votingPowerInequalityError,
  } = useVotingPowerInequality();

  const {
    data: erroneousRateData = { data: [], countData: [] },
    isLoading: isErroneousRateLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: erroneousRateError,
  } = useErroneousRate();

  const {
    data: voterTurnoutCategoryData = [],
    isLoading: isVoterTurnoutCategoryLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: voterTurnoutCategoryError,
  } = useVoterTurnoutCategory();

  const {
    data: capitalAllocationCategoryData = [],
    isLoading: isCapitalAllocationCategoryLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: capitalAllocationCategoryError,
  } = useCapitalAllocationCategory();

  const {
    data: proposalTrendCategoryData = {},
    isLoading: isProposalTrendCategoryLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: proposalTrendCategoryError,
  } = useProposalTrendCategory();

  const {
    data: approvalRateCategoryData = [],
    isLoading: isApprovalRateCategoryLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: approvalRateCategoryError,
  } = useApprovalRateCategory();

  const {
    data: approvalAmountCategoryData = [],
    isLoading: isApprovalAmountCategoryLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: approvalAmountCategoryError,
  } = useApprovalAmountCategory();

  const {
    data: treasuryOutflowData = { initiativeData: [], functionalData: [] },
    isLoading: isTreasuryOutflowLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: treasuryOutflowError,
  } = useTreasuryOutflow();

  return (
    <>
      <Header />
      <Hero title="OpenVis" description="Visualizing OpenGov data." />
      <div className="py-[50px] px-[68px]">
        <div className="flex flex-col gap-12">
          <section className="w-full">
            <DataCard
              title="Treasury Outflow Analysis"
              description="Visualize the flow of treasury funds to different initiative and functional categories, showing the distribution and magnitude of treasury allocations."
              isLoading={isTreasuryOutflowLoading}
            >
              <TreasuryOutflow data={treasuryOutflowData} />
            </DataCard>
          </section>
          
          <hr className="border-gray-200" />
          <section className="w-full">
            <DataCard
              title="Monthly Refs"
              description="Visualizing the number of proposals submitted each month."
              isLoading={isMonthlyRefsLoading}
            >
              <MonthlyRefs data={refData} />
            </DataCard>
          </section>

          <hr className="border-gray-200" />
          <section className="w-full">
            <DataCard
              title="Referendum Voting Power Distribution"
              description={[
                "The chart shows referendums ordered by voting power turnout (descending)",
                "The orange line shows the cumulative percentage of total voting power",
                "Steeper initial curve indicates higher inequality in voting power distribution",
              ]}
              isLoading={isRefVotingPowerTurnoutLoading}
            >
              <RefVotingPowerTurnout data={refVotingPowerTurnoutData} />
            </DataCard>
          </section>

          <hr className="border-gray-200" />
          <section className="w-full">
            <DataCard
              title="Voting Power Inequality"
              description="Visualizing the inequality in voting power distribution."
              isLoading={isVotingPowerInequalityLoading}
            >
              <VotingPowerInequality data={votingPowerInequalityData} />
            </DataCard>
          </section>

          <hr className="border-gray-200" />
          <section className="w-full">
            <DataCard
              title="Erroneous Rate Over Time"
              description="Track the percentage of erroneous proposals per month to identify users familiarity with the OpenGov system."
              isLoading={isErroneousRateLoading}
            >
              <ErroneousRate data={erroneousRateData} />
            </DataCard>
          </section>

          <hr className="border-gray-200" />
          <section className="w-full">
            <DataCard
              title="Vote Distribution by Category"
              description="See the percentage breakdown of votes across different proposal categories to understand community engagement patterns."
              isLoading={isVoterTurnoutCategoryLoading}
            >
              <VoterTurnoutCategory data={voterTurnoutCategoryData} />
            </DataCard>
          </section>

          <hr className="border-gray-200" />
          <section className="w-full">
            <DataCard
              title="Capital Allocation by Category"
              description="See the percentage breakdown of capital allocation across different proposal categories to understand funding distribution patterns."
              isLoading={isCapitalAllocationCategoryLoading}
            >
              <CapitalAllocationCategory data={capitalAllocationCategoryData} />
            </DataCard>
          </section>

          <hr className="border-gray-200" />
          <section className="w-full">
            <DataCard
              title="Proposal Trends by Category Over Time"
              description={[
                "Track how proposal activity varies across different categories over time to identify seasonal patterns and category-specific trends.",
                "Click on legend items to highlight specific categories.",
              ]}
              isLoading={isProposalTrendCategoryLoading}
            >
              <ProposalTrendCategory data={proposalTrendCategoryData} />
            </DataCard>
          </section>

          <hr className="border-gray-200" />
          <section className="w-full">
            <DataCard
              title="Approval Rate by Category"
              description="Compare approval rates across different proposal categories to identify which types of proposals have higher success rates."
              isLoading={isApprovalRateCategoryLoading}
            >
              <ApprovalRateCategory data={approvalRateCategoryData} />
            </DataCard>
          </section>

          <hr className="border-gray-200" />
          <section className="w-full">
            <DataCard
              title="Approval Amount by Category"
              description="Compare total approved funding amounts across different proposal categories to identify which categories receive the most financial support."
              isLoading={isApprovalAmountCategoryLoading}
            >
              <ApprovalAmountCategory data={approvalAmountCategoryData} />
            </DataCard>
          </section>

          <hr className="border-gray-200" />
          <section className="w-full">
            <AddressInfo />
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
