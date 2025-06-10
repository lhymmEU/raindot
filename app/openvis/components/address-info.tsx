"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";

interface AddressFundingInfo {
  address: string;
  totalRefs: {
    id: number;
    requested: number;
    status: string;
  }[];
  funding: {
    category: string;
    amount: number;
    refs: number[];
  }[];
  voting: {
    refId: number;
    category: string[];
    power: number;
    decision: "AYE" | "NAY" | "ABSTAIN";
  }[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    payload?: {
      category: string;
      amount: number;
      refs: number[];
      percentage?: number;
    };
  }>;
  label?: string;
}

interface ChartDataEntry {
  category: string;
  amount: number;
  percentage: number;
  fill: string;
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
  '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
];

// Category type definitions
const INITIATIVE_TYPES = ['New', 'Existing', 'Compensation', 'Protocol'];
const FUNCTIONAL_FOCUS = ['Marketing', 'Product', 'Event', 'EducationAndResearch', 'Security'];

// Helper function to format amounts
const formatAmount = (amount: number): string => {
  // Ensure amount is a valid number
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount === null || numAmount === undefined) {
    return "$0.00";
  }
  
  if (numAmount >= 1e9) {
    return `$${(numAmount / 1e9).toFixed(1)}B`;
  } else if (numAmount >= 1e6) {
    return `$${(numAmount / 1e6).toFixed(1)}M`;
  } else if (numAmount >= 1e3) {
    return `$${(numAmount / 1e3).toFixed(1)}K`;
  } else {
    return `$${numAmount.toFixed(2)}`;
  }
};

const CustomBarTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const amount = payload[0]?.value || 0;
    const formattedAmount = formatAmount(amount);
    const refCount = payload[0]?.payload?.refs?.length || 0;
    
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{`Category: ${label}`}</p>
        <p style={{ color: payload[0]?.color }}>
          {`Amount: ${formattedAmount}`}
        </p>
        <p className="text-gray-600">
          {`Refs: ${refCount}`}
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    const formattedAmount = formatAmount(data?.amount || 0);
    
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{`Category: ${data?.category}`}</p>
        <p style={{ color: payload[0]?.color }}>
          {`Amount: ${formattedAmount}`}
        </p>
        <p className="text-gray-600">
          {`Percentage: ${data?.percentage?.toFixed(1)}%`}
        </p>
      </div>
    );
  }
  return null;
};

export default function AddressInfo() {
  const [address, setAddress] = useState("");
  const [addressData, setAddressData] = useState<AddressFundingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'proposals' | 'voting'>('proposals');

  const handleSearch = async () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }

    setLoading(true);
    setError(null);
    setAddressData(null);

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/graph/address-funding-info?address=${encodeURIComponent(address.trim())}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const result = await response.json();
      
      if (result && result.data) {
        setAddressData(result.data);
        console.log("Address funding info fetched successfully:", result.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching address funding info:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch address information");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Prepare chart data separated by category type
  const initiativeTypeData = addressData?.funding
    .filter((item: { category: string; amount: number; refs: number[] }) => INITIATIVE_TYPES.includes(item.category))
    .map((item: { category: string; amount: number; refs: number[] }) => ({
      category: item.category,
      amount: item.amount,
      refs: item.refs
    })) || [];

  const functionalFocusData = addressData?.funding
    .filter((item: { category: string; amount: number; refs: number[] }) => FUNCTIONAL_FOCUS.includes(item.category))
    .map((item: { category: string; amount: number; refs: number[] }) => ({
      category: item.category,
      amount: item.amount,
      refs: item.refs
    })) || [];

  const initiativePieData = initiativeTypeData.map((item: { category: string; amount: number; refs: number[] }, index: number) => {
    const total = initiativeTypeData.reduce((sum: number, cat: { amount: number }) => sum + cat.amount, 0);
    return {
      category: item.category,
      amount: item.amount,
      percentage: total > 0 ? (item.amount / total) * 100 : 0,
      fill: COLORS[index % COLORS.length]
    };
  });

  const functionalPieData = functionalFocusData.map((item: { category: string; amount: number; refs: number[] }, index: number) => {
    const total = functionalFocusData.reduce((sum: number, cat: { amount: number }) => sum + cat.amount, 0);
    return {
      category: item.category,
      amount: item.amount,
      percentage: total > 0 ? (item.amount / total) * 100 : 0,
      fill: COLORS[index % COLORS.length]
    };
  });

  // Calculate summary statistics
  const totalFunding = addressData?.funding.reduce((sum: number, cat: { amount: number }) => sum + cat.amount, 0) || 0;
  const totalRefs = addressData?.totalRefs.length || 0;
  
  // Get unique approved refs to avoid double counting
  const uniqueApprovedRefs = new Set<number>();
  addressData?.funding.forEach((item: { refs: number[] }) => {
    item.refs.forEach((refId: number) => uniqueApprovedRefs.add(refId));
  });
  const approvedRefs = uniqueApprovedRefs.size;

  // Calculate voting statistics
  const totalVotes = addressData?.voting.length || 0;
  const ayeVotes = addressData?.voting.filter(vote => vote.decision === 'AYE').length || 0;
  const nayVotes = addressData?.voting.filter(vote => vote.decision === 'NAY').length || 0;
  const abstainVotes = addressData?.voting.filter(vote => vote.decision === 'ABSTAIN').length || 0;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-gray-400">Address Funding Information (Beta)</h1>
        <p className="text-gray-500">Search for detailed funding information and proposal history for any Polkadot governance address.</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-yellow-700 text-sm">
            ⚠️ This feature is still under development. Data returned might not reflect the latest state of the network. Please use with caution.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex gap-3 mb-6 max-w-2xl">
        <Input
          type="text"
          placeholder="Enter wallet address (e.g., 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY)"
          className="flex-1"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button 
          onClick={handleSearch} 
          disabled={loading}
          className="px-6"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {addressData && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Funding</h3>
              <p className="text-2xl font-bold text-green-600">{formatAmount(totalFunding)}</p>
            </div>
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Proposals</h3>
              <p className="text-2xl font-bold text-blue-600">{totalRefs}</p>
            </div>
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl font-bold text-green-500">{approvedRefs}</p>
            </div>
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
              <p className="text-2xl font-bold text-purple-600">
                {totalRefs > 0 ? `${((approvedRefs / totalRefs) * 100).toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Votes</h3>
              <p className="text-2xl font-bold text-orange-600">{totalVotes}</p>
            </div>
          </div>

          {/* Address Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Address Details</h3>
            <p className="text-sm text-gray-600 break-all">{addressData.address}</p>
          </div>

          {/* Charts Section */}
          {(initiativeTypeData.length > 0 || functionalFocusData.length > 0) && (
            <div className="space-y-8">
              {/* Initiative Type Charts */}
              {initiativeTypeData.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Initiative Type Analysis</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart - Initiative Type */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Funding by Initiative Type</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={initiativeTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="category" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              interval={0}
                              fontSize={12}
                            />
                            <YAxis tickFormatter={formatAmount} />
                            <Tooltip content={<CustomBarTooltip />} />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie Chart - Initiative Type Distribution */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Initiative Type Distribution</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={initiativePieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="amount"
                            >
                              {initiativePieData.map((entry: ChartDataEntry, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Functional Focus Charts */}
              {functionalFocusData.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Functional Focus Analysis</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart - Functional Focus */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Funding by Functional Focus</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={functionalFocusData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="category" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              interval={0}
                              fontSize={12}
                            />
                            <YAxis tickFormatter={formatAmount} />
                            <Tooltip content={<CustomBarTooltip />} />
                            <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie Chart - Functional Focus Distribution */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Functional Focus Distribution</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={functionalPieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="amount"
                            >
                              {functionalPieData.map((entry: ChartDataEntry, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tables Section with Tabs */}
          {(addressData.totalRefs.length > 0 || addressData.voting.length > 0) && (
            <div className="bg-white border rounded-lg">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab('proposals')}
                    className={`py-3 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'proposals'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Proposal History ({addressData.totalRefs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('voting')}
                    className={`py-3 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'voting'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Voting History ({addressData.voting.length})
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'proposals' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Proposal History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Proposal ID</th>
                            <th className="text-left p-2">Requested Amount</th>
                            <th className="text-left p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addressData.totalRefs.map((ref: { id: number; requested: number; status: string }) => (
                            <tr key={ref.id} className="border-b hover:bg-gray-50">
                              <td className="p-2">#{ref.id}</td>
                              <td className="p-2">{formatAmount(ref.requested)}</td>
                              <td className="p-2">
                                <span
                                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    ref.status === 'Approved' || ref.status === 'Executed'
                                      ? 'bg-green-100 text-green-800'
                                      : ref.status === 'Rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : ref.status === 'Voting'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {ref.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'voting' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Voting History</h3>
                    {/* Voting Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-green-700">AYE Votes</h4>
                        <p className="text-xl font-bold text-green-600">{ayeVotes}</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-red-700">NAY Votes</h4>
                        <p className="text-xl font-bold text-red-600">{nayVotes}</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-700">ABSTAIN Votes</h4>
                        <p className="text-xl font-bold text-gray-600">{abstainVotes}</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-blue-700">Total Votes</h4>
                        <p className="text-xl font-bold text-blue-600">{totalVotes}</p>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Ref ID</th>
                            <th className="text-left p-2">Categories</th>
                            <th className="text-left p-2">Voting Power</th>
                            <th className="text-left p-2">Decision</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addressData.voting.map((vote: { refId: number; category: string[]; power: number; decision: "AYE" | "NAY" | "ABSTAIN" }, index: number) => (
                            <tr key={`${vote.refId}-${index}`} className="border-b hover:bg-gray-50">
                              <td className="p-2">#{vote.refId}</td>
                              <td className="p-2">
                                <div className="flex flex-wrap gap-1">
                                  {vote.category.map((cat, catIndex) => (
                                    <span
                                      key={catIndex}
                                      className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                    >
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-2">{vote.power.toLocaleString()}</td>
                              <td className="p-2">
                                <span
                                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    vote.decision === 'AYE'
                                      ? 'bg-green-100 text-green-800'
                                      : vote.decision === 'NAY'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {vote.decision}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No results message */}
      {!loading && !error && addressData && addressData.totalRefs.length === 0 && addressData.voting.length === 0 && (
        <div className="bg-gray-50 border rounded-md p-6 text-center">
          <p className="text-gray-600">No proposals or voting history found for this address.</p>
        </div>
      )}
    </div>
  );
}
