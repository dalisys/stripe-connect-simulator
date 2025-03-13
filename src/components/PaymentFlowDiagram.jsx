"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react";

// Edge style customization
const edgeOptions = {
  animated: true,
  style: {
    stroke: "#4B5563",
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#4B5563",
  },
};

// Edge with money amount label
function MoneyFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  // Calculate the path and label position
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2 - 10;

  const amount = data?.amount || "";
  const description = data?.description || "";
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={2}
        stroke="#4B5563"
      />
      {amount && (
        <foreignObject
          width={100}
          height={40}
          x={labelX - 50}
          y={labelY - 20}
          className="overflow-visible"
        >
          <div className="flex items-center justify-center">
            <div className="bg-white text-gray-800 px-2 py-1 rounded-full border border-gray-200 text-xs sm:text-sm font-medium shadow-xs">
              ${typeof amount === "number" ? amount.toFixed(2) : amount}
            </div>
          </div>
        </foreignObject>
      )}
    </>
  );
}

// Custom edge types
const edgeTypes = {
  moneyFlow: MoneyFlowEdge,
};

export default function PaymentFlowDiagram({ data, config }) {
  const {
    stripeFeePercent,
    stripeFeeFixed,
    internationalFee,
    payoutFee,
    monthlyFee,
    applicationFee,
    instantPayoutFee,
    connectedAccountAmount,
    platformAmount,
    totalAmount,
    feeHandlingType,
    accountType,
    chargeType,
  } = data;

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const totalStripeFee =
    stripeFeePercent.amount +
    stripeFeeFixed.amount +
    (internationalFee ? internationalFee.amount : 0) +
    payoutFee.amount +
    monthlyFee.amount;

  // Create positioned nodes based on charge type
  const createNodes = useCallback(() => {
    // Base scaling factor for mobile
    const isMobile = windowWidth < 768;
    const scale = isMobile ? 0.8 : 1;

    // Adjust node positions based on charge type and screen size
    let customerPos, connectedAccountPos, platformPos, stripePos;

    if (chargeType === "direct") {
      // Direct charge layout
      if (isMobile) {
        customerPos = { x: 0, y: 50 };
        connectedAccountPos = { x: 250, y: 50 };
        platformPos = { x: 0, y: 300 };
        stripePos = { x: 250, y: 300 };
      } else {
        customerPos = { x: 5, y: 70 };
        connectedAccountPos = { x: 250, y: 50 };
        platformPos = { x: 50, y: 350 };
        stripePos =
          feeHandlingType === "platform"
            ? { x: 350, y: 350 }
            : { x: 350, y: 350 };
      }
    } else if (chargeType === "destination") {
      // Destination charge layout
      if (isMobile) {
        customerPos = { x: 0, y: 50 };
        platformPos = { x: 250, y: 50 };
        connectedAccountPos = { x: 0, y: 300 };
        stripePos = { x: 250, y: 300 };
      } else {
        customerPos = { x: 50, y: 70 };
        platformPos = { x: 350, y: 70 };
        connectedAccountPos = { x: 650, y: 70 };
        stripePos = { x: 550, y: 300 };
      }
    } else {
      // separate
      if (isMobile) {
        customerPos = { x: 0, y: 50 };
        platformPos = { x: 250, y: 50 };
        connectedAccountPos = { x: 0, y: 300 };
        stripePos = { x: 250, y: 300 };
      } else {
        customerPos = { x: 50, y: 70 };
        platformPos = { x: 350, y: 70 };
        connectedAccountPos = { x: 650, y: 70 };
        stripePos = { x: 350, y: 300 };
      }
    }

    return [
      // Customer node
      {
        id: "customer",
        type: "default",
        data: {
          label: (
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1a56db"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      width="20"
                      height="14"
                      x="2"
                      y="5"
                      rx="2"
                    />
                    <line
                      x1="2"
                      x2="22"
                      y1="10"
                      y2="10"
                    />
                  </svg>
                </div>
              </div>
              <div className="font-medium">Customer</div>
              <div className="text-green-600 font-medium">
                ${totalAmount.toFixed(2)}
              </div>
            </div>
          ),
        },
        position: customerPos,
        sourcePosition: "right",
        style: {
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          width: isMobile ? 120 : 140,
        },
      },

      // Connected Account node
      {
        id: "connected-account",
        type: "default",
        data: {
          label: (
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="bg-purple-100 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7e22ce"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 20a6 6 0 0 0-12 0" />
                    <circle
                      cx="12"
                      cy="10"
                      r="4"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                    />
                  </svg>
                </div>
              </div>
              <div className="font-medium">Connected Account</div>
              <div className="text-green-600 font-medium">
                ${connectedAccountAmount.toFixed(2)}
              </div>
              {feeHandlingType === "stripe" && (
                <div className="mt-2 space-y-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-white rounded-full px-3 py-1 border border-gray-200 text-sm flex items-center gap-1 mx-auto cursor-help">
                          <span className="font-medium">
                            -${stripeFeePercent.amount.toFixed(2)}
                          </span>
                          <Info className="h-4 w-4 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">
                          {stripeFeePercent.description}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-white rounded-full px-3 py-1 border border-gray-200 text-sm flex items-center gap-1 mx-auto cursor-help">
                          <span className="font-medium">
                            -${stripeFeeFixed.amount.toFixed(2)}
                          </span>
                          <Info className="h-4 w-4 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">{stripeFeeFixed.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          ),
        },
        position: connectedAccountPos,
        sourcePosition: chargeType === "direct" ? "bottom" : "bottom",
        targetPosition: chargeType === "direct" ? "left" : "left",
        style: {
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          width: isMobile ? 180 : 220,
        },
      },

      // Platform node
      {
        id: "platform",
        type: "default",
        data: {
          label: (
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1a56db"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      width="18"
                      height="18"
                      x="3"
                      y="3"
                      rx="2"
                    />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
              </div>
              <div className="font-medium">Platform</div>
              <div className="text-blue-600 font-medium">
                ${platformAmount.toFixed(2)}
              </div>
            </div>
          ),
        },
        position: platformPos,
        sourcePosition: "right",
        targetPosition: chargeType === "direct" ? "top" : "left",
        style: {
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          width: isMobile ? 140 : 180,
        },
      },

      // Stripe node
      {
        id: "stripe",
        type: "default",
        data: {
          label: (
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="bg-indigo-500 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                    />
                  </svg>
                </div>
              </div>
              <div className="font-medium">Stripe</div>
              <div className="text-gray-600 text-sm">
                Fees paid by:{" "}
                {feeHandlingType === "platform"
                  ? "Platform"
                  : "Connected Account"}
              </div>
              <div className="mt-2 flex justify-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white rounded-full px-3 py-1 border border-gray-200 text-sm flex items-center gap-1 cursor-help">
                        <span className="font-medium">
                          ${totalStripeFee.toFixed(2)}
                        </span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-sm"
                    >
                      <div className="text-xs space-y-1">
                        <p>
                          Processing fee: ${stripeFeePercent.amount.toFixed(2)}
                        </p>
                        <p>Fixed fee: ${stripeFeeFixed.amount.toFixed(2)}</p>
                        {internationalFee?.amount > 0 && (
                          <p>
                            International fee: $
                            {internationalFee.amount.toFixed(2)}
                          </p>
                        )}
                        {payoutFee?.amount > 0 && (
                          <p>Payout fee: ${payoutFee.amount.toFixed(2)}</p>
                        )}
                        {monthlyFee?.amount > 0 && (
                          <p>Monthly fee: ${monthlyFee.amount.toFixed(2)}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ),
        },
        position: stripePos,
        targetPosition:
          chargeType === "direct" && feeHandlingType === "platform"
            ? "left"
            : chargeType === "direct"
            ? "top"
            : "top",
        style: {
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          width: isMobile ? 160 : 200,
        },
      },
    ];
  }, [
    chargeType,
    feeHandlingType,
    stripeFeePercent,
    stripeFeeFixed,
    internationalFee,
    payoutFee,
    monthlyFee,
    applicationFee,
    instantPayoutFee,
    connectedAccountAmount,
    platformAmount,
    totalAmount,
    windowWidth,
  ]);

  // Get initial nodes
  const initialNodes = createNodes();

  // Initial edges will be created by createEdges function
  const initialEdges = [];

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Initialize the nodes and edges on component mount
  useEffect(() => {
    setNodes(createNodes());
    setEdges(createEdges());
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Create edges based on charge type and fee handling
  const createEdges = useCallback(() => {
    let newEdges = [];

    // Different edges based on charge type
    if (chargeType === "direct") {
      // Direct charge flow - customer pays connected account directly
      newEdges.push({
        id: "customer-to-connected",
        source: "customer",
        target: "connected-account",
        type: "moneyFlow",
        sourcePosition: "right",
        targetPosition: "left",
        data: {
          amount: totalAmount,
          description: "Payment",
        },
      });
    } else if (chargeType === "destination") {
      // Destination charge flow - customer pays platform, which transfers to connected account
      newEdges.push({
        id: "customer-to-platform",
        source: "customer",
        target: "platform",
        type: "moneyFlow",
        sourcePosition: "right",
        targetPosition: "left",
        data: {
          amount: totalAmount,
          description: "Payment",
        },
      });

      newEdges.push({
        id: "platform-to-connected",
        source: "platform",
        target: "connected-account",
        type: "moneyFlow",
        sourcePosition: "right",
        targetPosition: "left",
        data: {
          amount:
            connectedAccountAmount +
            (feeHandlingType === "stripe" ? totalStripeFee : 0),
          description: "Transfer",
        },
      });
    } else if (chargeType === "separate") {
      // Separate charges flow - platform charges customer, then separately transfers to connected account
      newEdges.push({
        id: "customer-to-platform",
        source: "customer",
        target: "platform",
        type: "moneyFlow",
        sourcePosition: "right",
        targetPosition: "left",
        data: {
          amount: totalAmount,
          description: "Payment",
        },
      });

      newEdges.push({
        id: "platform-to-connected",
        source: "platform",
        target: "connected-account",
        type: "moneyFlow",
        sourcePosition: "right",
        targetPosition: "left",
        data: {
          amount:
            connectedAccountAmount +
            (feeHandlingType === "stripe" ? totalStripeFee : 0),
          description: "Separate Transfer",
        },
      });
    }

    // Application Fee edge for all charge types
    if (applicationFee.amount > 0) {
      if (chargeType === "direct") {
        newEdges.push({
          id: "connected-to-platform",
          source: "connected-account",
          target: "platform",
          type: "moneyFlow",
          sourcePosition: "bottom",
          targetPosition: "right",
          data: {
            amount: applicationFee.amount,
            description: "Application Fee",
          },
        });
      }
      // For destination and separate, the application fee is already taken out in the transfer amount
    }

    // Stripe Fee edge (from whoever pays the fees)
    if (feeHandlingType === "platform") {
      if (chargeType === "direct") {
        // For direct charges when platform handles fees, connect platform to stripe
        newEdges.push({
          id: "platform-to-stripe",
          source: "platform",
          target: "stripe",
          type: "moneyFlow",
          sourcePosition: "right",
          targetPosition: "left",
          data: {
            amount: totalStripeFee,
            description: "Stripe Fees",
            color: "#ef4444", // Red for Stripe fees
          },
        });
      } else {
        // For destination and separate charges when platform handles fees
        newEdges.push({
          id: "platform-to-stripe",
          source: "platform",
          target: "stripe",
          type: "moneyFlow",
          sourcePosition:
            chargeType === "destination" || chargeType === "separate"
              ? "bottom"
              : "right",
          targetPosition:
            chargeType === "destination" || chargeType === "separate"
              ? "top"
              : "left",
          data: {
            amount: totalStripeFee,
            description: "Stripe Fees",
            color: "#ef4444", // Red for Stripe fees
          },
        });
      }
    } else {
      // For charge types that go through the connected account
      if (chargeType === "direct") {
        newEdges.push({
          id: "connected-to-stripe",
          source: "connected-account",
          target: "stripe",
          type: "moneyFlow",
          sourcePosition: "bottom",
          targetPosition: "top",
          data: {
            amount: totalStripeFee,
            description: "Stripe Fees",
          },
        });
      } else {
        // For destination and separate charges where connected account pays stripe fees,
        // the fees are taken from the amount transferred
        newEdges.push({
          id: "connected-to-stripe",
          source: "connected-account",
          target: "stripe",
          type: "moneyFlow",
          sourcePosition:
            chargeType === "destination" || chargeType === "separate"
              ? "bottom"
              : "bottom",
          targetPosition:
            chargeType === "destination" || chargeType === "separate"
              ? "top"
              : "top",
          data: {
            amount: totalStripeFee,
            description: "Stripe Fees",
          },
        });
      }
    }

    return newEdges;
  }, [
    chargeType,
    feeHandlingType,
    totalAmount,
    connectedAccountAmount,
    applicationFee.amount,
    totalStripeFee,
  ]);

  // Update nodes and edges when data or charge type changes
  useEffect(() => {
    // Create fresh nodes and edges based on the current data
    const updatedNodes = createNodes();
    const updatedEdges = createEdges();

    setNodes(updatedNodes);
    setEdges(updatedEdges);

    // If the flow instance exists, fit the view to show all elements
    setTimeout(() => {
      if (reactFlowInstance) {
        // Apply different zoom levels based on screen size
        const isMobile = window.innerWidth < 768;
        const padding = isMobile ? 0.5 : 0.2;
        const defaultZoom = isMobile ? 0.6 : 1;

        reactFlowInstance.setViewport({ x: 0, y: 0, zoom: defaultZoom });
        reactFlowInstance.fitView({ padding });
      }
    }, 50);
  }, [data, config, createNodes, createEdges, chargeType, feeHandlingType]);

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
    setTimeout(() => {
      // Apply different zoom levels based on screen size
      const isMobile = window.innerWidth < 768;
      const padding = isMobile ? 0.5 : 0.2;
      const defaultZoom = isMobile ? 0.6 : 1;

      instance.setViewport({ x: 0, y: 0, zoom: defaultZoom });
      instance.fitView({ padding });
    }, 50);
  }, []);

  // Function to reset the flow to initial positioning
  const resetFlow = useCallback(() => {
    if (reactFlowInstance) {
      // Reset to initial nodes and edges
      const initialNodes = createNodes();
      const initialEdges = createEdges();

      setNodes(initialNodes);
      setEdges(initialEdges);

      // Reset viewport and fit view with different zoom levels based on screen size
      const isMobile = window.innerWidth < 768;
      const padding = isMobile ? 0.5 : 0.2;
      const defaultZoom = isMobile ? 0.6 : 1;

      reactFlowInstance.setViewport({ x: 0, y: 0, zoom: defaultZoom });
      setTimeout(() => {
        reactFlowInstance.fitView({ padding });
      }, 50);
    }
  }, [reactFlowInstance, createNodes, createEdges]);

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={edgeOptions}
        fitView
        minZoom={0.4}
        maxZoom={2}
        defaultZoom={windowWidth < 768 ? 0.6 : 1}
        zoomOnScroll={false}
        zoomOnPinch={true}
        panOnScroll={true}
        panOnDrag={true}
        nodesDraggable={true}
        className="react-flow-container"
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>

      {/* Reset button moved outside the flow for better clickability */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50">
        <button
          className="p-1.5 sm:px-3 sm:py-1.5 bg-blue-600 text-white rounded border shadow-md text-sm hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center"
          onClick={resetFlow}
          aria-label="Reset flow diagram"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sm:mr-1"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          <span className="hidden sm:inline">Reset Flow</span>
        </button>
      </div>

      {/* Payout timing indicator for Express accounts */}
      {accountType === "express" && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 text-gray-600 bg-white p-1.5 sm:p-2 rounded border shadow-xs z-10">
          <span>Payout:</span>
          <span className="font-medium">
            {config.payoutTiming === "standard" ? "Standard" : "Instant (1%)"}
          </span>
        </div>
      )}
    </div>
  );
}
