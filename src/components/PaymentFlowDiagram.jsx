'use client'

import { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Info } from 'lucide-react';

// Edge style customization
const edgeOptions = {
  animated: true,
  style: {
    stroke: '#4B5563',
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#4B5563',
  },
};

// Edge with money amount label
function MoneyFlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) {
  // Calculate the path and label position
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2 - 10;
  
  const amount = data?.amount || '';
  const description = data?.description || '';
  
  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} strokeWidth={2} stroke="#4B5563" />
      {amount && (
        <foreignObject
          width={100}
          height={40}
          x={labelX - 50}
          y={labelY - 20}
          className="overflow-visible"
        >
          <div className="flex items-center justify-center">
            <div className="bg-white text-gray-800 px-2 py-1 rounded-full border border-gray-200 text-sm font-medium shadow-xs">
              ${typeof amount === 'number' ? amount.toFixed(2) : amount}
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
    chargeType
  } = data;

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const totalStripeFee = stripeFeePercent.amount + stripeFeeFixed.amount + 
                        (internationalFee ? internationalFee.amount : 0) +
                        payoutFee.amount +
                        monthlyFee.amount;

  // Create nodes based on flow type (vertical layout)
  const initialNodes = [
    // Customer node
    {
      id: 'customer',
      type: 'default',
      data: { 
        label: (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-blue-100 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
            </div>
            <div className="font-medium">Customer</div>
            <div className="text-green-600 font-medium">${totalAmount.toFixed(2)}</div>
          </div>
        )
      },
      position: { x: 200, y: 50 },
      style: {
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        width: 180,
      },
    },
    
    // Connected Account node
    {
      id: 'connected-account',
      type: 'default',
      data: { 
        label: (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-purple-100 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20a6 6 0 0 0-12 0" />
                  <circle cx="12" cy="10" r="4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
            </div>
            <div className="font-medium">Connected Account</div>
            <div className="text-green-600 font-medium">${connectedAccountAmount.toFixed(2)}</div>
            {feeHandlingType === 'stripe' && (
              <div className="mt-2 space-y-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white rounded-full px-3 py-1 border border-gray-200 text-sm flex items-center gap-1 mx-auto cursor-help">
                        <span className="font-medium">-${stripeFeePercent.amount.toFixed(2)}</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">{stripeFeePercent.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white rounded-full px-3 py-1 border border-gray-200 text-sm flex items-center gap-1 mx-auto cursor-help">
                        <span className="font-medium">-${stripeFeeFixed.amount.toFixed(2)}</span>
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
        )
      },
      position: { x: 200, y: 200 },
      style: {
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        width: 220,
      },
    },
    
    // Platform node
    {
      id: 'platform',
      type: 'default',
      data: { 
        label: (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-blue-100 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
            </div>
            <div className="font-medium">Platform</div>
            <div className="text-blue-600 font-medium">${platformAmount.toFixed(2)}</div>
          </div>
        )
      },
      position: { x: 50, y: 350 },
      style: {
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        width: 180,
      },
    },
    
    // Stripe node
    {
      id: 'stripe',
      type: 'default',
      data: { 
        label: (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-indigo-500 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
            </div>
            <div className="font-medium">Stripe</div>
            <div className="text-gray-600 text-sm">
              Fees paid by: {feeHandlingType === 'platform' ? 'Platform' : 'Connected Account'}
            </div>
            <div className="mt-2 flex justify-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-white rounded-full px-3 py-1 border border-gray-200 text-sm flex items-center gap-1 cursor-help">
                      <span className="font-medium">${totalStripeFee.toFixed(2)}</span>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <div className="text-xs space-y-1">
                      <p>Processing fee: ${stripeFeePercent.amount.toFixed(2)}</p>
                      <p>Fixed fee: ${stripeFeeFixed.amount.toFixed(2)}</p>
                      {internationalFee?.amount > 0 && <p>International fee: ${internationalFee.amount.toFixed(2)}</p>}
                      {payoutFee?.amount > 0 && <p>Payout fee: ${payoutFee.amount.toFixed(2)}</p>}
                      {monthlyFee?.amount > 0 && <p>Monthly fee: ${monthlyFee.amount.toFixed(2)}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )
      },
      position: { x: 350, y: 350 },
      style: {
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        width: 200,
      },
    },
  ];

  // Create edges based on charge type and fee handling
  let initialEdges = [];
  
  // Customer to Connected Account edge (for payment)
  initialEdges.push({
    id: 'customer-to-connected',
    source: 'customer',
    target: 'connected-account',
    type: 'moneyFlow',
    data: { 
      amount: totalAmount,
      description: 'Payment'
    },
  });
  
  // Application Fee edge
  if (applicationFee.amount > 0) {
    initialEdges.push({
      id: 'connected-to-platform',
      source: 'connected-account',
      target: 'platform',
      type: 'moneyFlow',
      data: { 
        amount: applicationFee.amount,
        description: 'Application Fee'
      },
    });
  }
  
  // Stripe Fee edge (from whoever pays the fees)
  if (feeHandlingType === 'platform') {
    initialEdges.push({
      id: 'platform-to-stripe',
      source: 'platform',
      target: 'stripe',
      type: 'moneyFlow',
      data: { 
        amount: totalStripeFee,
        description: 'Stripe Fees'
      },
    });
  } else {
    initialEdges.push({
      id: 'connected-to-stripe',
      source: 'connected-account',
      target: 'stripe',
      type: 'moneyFlow',
      data: { 
        amount: totalStripeFee,
        description: 'Stripe Fees'
      },
    });
  }
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update nodes and edges when data changes
  useEffect(() => {
    // Update node data
    const updatedNodes = initialNodes.map(node => {
      return {
        ...node,
        data: {
          ...node.data
        }
      };
    });

    // Update edges and their data
    const updatedEdges = initialEdges.map(edge => {
      return {
        ...edge
      };
    });

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [data, config]);

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
    setTimeout(() => {
      instance.fitView({ padding: 0.2 });
    }, 50);
  }, []);

  return (
    <div className="w-full h-[500px]">
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
        zoomOnScroll={false}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        panOnDrag={true}
        attributionPosition="bottom-right"
      >
        <Controls showInteractive={false} />
        <Background color="#f1f5f9" gap={16} />
      </ReactFlow>
      
      {/* Controls for zoom */}
      <div className="absolute bottom-4 left-4 flex flex-col bg-white rounded border shadow-xs">
        <button 
          className="px-2.5 py-1.5 text-gray-700 hover:bg-gray-100 text-lg border-b"
          onClick={() => reactFlowInstance?.zoomIn()}
        >
          +
        </button>
        <button 
          className="px-2.5 py-1.5 text-gray-700 hover:bg-gray-100 text-lg border-b"
          onClick={() => reactFlowInstance?.zoomOut()}
        >
          −
        </button>
        <button 
          className="px-2.5 py-1.5 text-gray-700 hover:bg-gray-100 text-lg border-b"
          onClick={() => reactFlowInstance?.fitView({ padding: 0.2 })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
        <button 
          className="px-2.5 py-1.5 text-gray-700 hover:bg-gray-100 text-lg"
          onClick={() => reactFlowInstance?.fitView({ padding: 0.2 })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
            <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
            <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
            <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
          </svg>
        </button>
      </div>
      
      {/* Reset button */}
      <div className="absolute bottom-4 right-4">
        <button 
          className="px-3 py-1.5 bg-white rounded border shadow-xs text-gray-700 text-sm hover:bg-gray-100"
          onClick={() => reactFlowInstance?.fitView({ padding: 0.2 })}
        >
          Reset Flow
        </button>
      </div>
      
      {/* Payout timing indicator for Express accounts */}
      {accountType === 'express' && (
        <div className="absolute top-4 right-4 text-sm flex items-center space-x-2 text-gray-600 bg-white p-2 rounded border shadow-xs">
          <span>Payout timing:</span>
          <span className="font-medium">
            {config.payoutTiming === 'standard' ? 'Standard (2-3 days)' : 'Instant (1% fee)'}
          </span>
        </div>
      )}
    </div>
  );
}