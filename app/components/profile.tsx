"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Link,
  Calendar,
  Building2,
  DollarSign,
  Target,
  Share2,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
} from "lucide-react";

type ProfileData = {
  Name: string;
  Description: {
    Leaders: string[];
    "Site/Hub": string;
    State: string;
    Relations: string[];
    Since: number;
    To: number;
    Category: string;
    Structure: string;
    Size: number;
  };
  Funding: {
    Total: number;
    "DOT Address": string;
    Sources: string[];
  };
  Content: {
    Purpose: string;
    Class: string[];
    Formats: string[];
  };
  Distribution: {
    "M. Platforms": string[];
    "S. Platforms": string[];
    "Funnel Lv1": string[];
    Audience: string[];
    Language: string[];
    Geographic: string[];
    chats: string[];
    Members: number;
  };
  Outcomes: {
    Deliverables: string[];
    Impact: string[];
    "Reach Source": string[];
    "Strategic Impact": string[];
    Reports: string[];
  };
  Evaluation: {
    Strengths: string[];
    Opportunities: string[];
    Challenges: string[];
    Notes: string[];
  };
};

export function ProfileCard({ data }: { data: ProfileData }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <Card className="w-full max-w-4xl shadow-sm p-0 border-0 overflow-hidden rounded-lg">
      <CardHeader className="bg-gradient-to-r from-gray-500 to-black text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{data.Name}</CardTitle>
            <CardDescription className="text-violet-100 mt-1">
              {data.Description.Category} • {data.Description.Structure}
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-white text-white">
            {data.Description.State}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              {data.Description.Since} - {data.Description.To === 0 ? "Present" : data.Description.To}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-4 w-4" />
            <span>{data.Description.Size === 0 ? "Unknown" : data.Description.Size} team members</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Building2 className="h-4 w-4" />
            <span>{data.Distribution.Members === 0 ? "Unknown" : data.Distribution.Members} community members</span>
          </div>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-2">
        <TabsList className="grid grid-cols-6 bg-gray-100 w-full">
          <TabsTrigger value="description">Overview</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        </TabsList>

        <CardContent className="p-6">
          <TabsContent value="description" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Users className="h-5 w-5 text-black" />
                  Leadership
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.Description.Leaders.map((leader, i) => (
                    <Badge key={i} variant="secondary">
                      {leader}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Link className="h-5 w-5 text-black" />
                  Website
                </h3>
                <a
                  href={data.Description["Site/Hub"]}
                  className="mt-2 text-blue-600 hover:underline block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.Description["Site/Hub"]}
                </a>
              </div>

              {data.Description.Relations.length !== 0 && <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-black" />
                  Relations
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.Description.Relations.map((relation, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="border-violet-200"
                    >
                      {relation}
                    </Badge>
                  ))}
                </div>
              </div>}
            </div>
          </TabsContent>

          <TabsContent value="funding" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-black" />
                  Total Funding
                </h3>
                <span className="text-xl font-bold">
                  ${data.Funding.Total.toLocaleString()}
                </span>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium">DOT Address</h3>
                <code className="mt-2 block p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                  {data.Funding["DOT Address"]}
                </code>
              </div>

              <div>
                <h3 className="text-lg font-medium">Funding Sources</h3>
                <ul className="mt-2 space-y-1">
                  {data.Funding.Sources.map((source, i) => (
                    <li key={i} className="flex items-center gap-2 w-fit inline-flex ml-4">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Target className="h-5 w-5 text-black" />
                  Purpose
                </h3>
                <p className="mt-2 text-gray-700">{data.Content.Purpose}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium">Content Classes</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.Content.Class.map((cls, i) => (
                      <Badge key={i} variant="secondary">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Content Formats</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.Content.Formats.map((format, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-violet-200"
                      >
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium">Main Platforms</h3>
                  <ul className="mt-2 space-y-1">
                    {data.Distribution["M. Platforms"].map((platform, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                        {platform}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Secondary Platforms</h3>
                  <ul className="mt-2 space-y-1">
                    {data.Distribution["S. Platforms"].map((platform, i) => (
                      <li key={i} className="flex items-center gap-1 w-fit inline-flex ml-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                        {platform}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium">Audience</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.Distribution.Audience.map((audience, i) => (
                      <Badge key={i} variant="secondary">
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Languages</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.Distribution.Language.map((lang, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-violet-200"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Geographic Focus</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.Distribution.Geographic.map((geo, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="border-violet-200"
                    >
                      {geo}
                    </Badge>
                  ))}
                </div>
              </div>

              {data.Distribution.chats.length !== 0 && <div>
                <h3 className="text-lg font-medium">Community Chats</h3>
                <div className="mt-2 space-y-1">
                  {data.Distribution.chats.map((chat, i) => (
                    <a
                      key={i}
                      href={chat}
                      className="text-blue-600 hover:underline block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {chat}
                    </a>
                  ))}
                </div>
              </div>}
            </div>
          </TabsContent>

          <TabsContent value="outcomes" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-black" />
                  Deliverables
                </h3>
                <ul className="mt-2 space-y-1">
                  {data.Outcomes.Deliverables.map((deliverable, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium">Impact</h3>
                  <ul className="mt-2 space-y-1">
                    {data.Outcomes.Impact.map((impact, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                        {impact}
                      </li>
                    ))}
                  </ul>
                </div>

                {data.Outcomes["Strategic Impact"].length !== 0 && <div>
                  <h3 className="text-lg font-medium">Strategic Impact</h3>
                  <ul className="mt-2 space-y-1">
                    {data.Outcomes["Strategic Impact"].map((impact, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                        {impact}
                      </li>
                    ))}
                  </ul>
                </div>}
              </div>

              {data.Outcomes["Reach Source"].length !== 0 && <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-black" />
                  Reach Sources
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.Outcomes["Reach Source"].map((source, i) => (
                    <Badge key={i} variant="secondary">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>}

              {data.Outcomes.Reports.length !== 0 && <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5 text-black" />
                  Reports
                </h3>
                <div className="mt-2 space-y-1">
                  {data.Outcomes.Reports.map((report, i) => (
                    <a
                      key={i}
                      href={report}
                      className="text-blue-600 hover:underline block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {report}
                    </a>
                  ))}
                </div>
              </div>}
            </div>
          </TabsContent>

          <TabsContent value="evaluation" className="mt-0">
            <div className="space-y-6">
              {data.Evaluation.Strengths.length !== 0 && <div>
                <h3 className="text-lg font-medium flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </h3>
                <ul className="mt-2 space-y-1">
                  {data.Evaluation.Strengths.map((strength, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>}

              {data.Evaluation.Opportunities.length !== 0 && <div>
                <h3 className="text-lg font-medium flex items-center gap-2 text-amber-600">
                  <Lightbulb className="h-5 w-5" />
                  Opportunities
                </h3>
                <ul className="mt-2 space-y-1">
                  {data.Evaluation.Opportunities.map((opportunity, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </div>}

              {data.Evaluation.Challenges.length !== 0 && <div>
                <h3 className="text-lg font-medium flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Challenges
                </h3>
                <ul className="mt-2 space-y-1">
                  {data.Evaluation.Challenges.map((challenge, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>}

              {data.Evaluation.Notes.length !== 0 && <div>
                <h3 className="text-lg font-medium">Notes</h3>
                <ul className="mt-2 space-y-1 bg-gray-50 p-3 rounded-md">
                  {data.Evaluation.Notes.map((note, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 italic text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-2"></span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
