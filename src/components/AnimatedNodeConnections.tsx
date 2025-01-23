'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { useNodeConnections } from '@/hooks/useNodeConnection';

interface Node {
  id: string;
  image: string;
  title: string;
  imagePosition: 'top' | 'bottom';
}

const nodes: Node[] = [
  {
    id: '1',
    image: '/placeholder.svg?height=100&width=100',
    title: 'Node 1',
    imagePosition: 'top',
  },
  {
    id: '2',
    image: '/placeholder.svg?height=100&width=100',
    title: 'Node 2',
    imagePosition: 'bottom',
  },
  {
    id: '3',
    image: '/placeholder.svg?height=100&width=100',
    title: 'Node 3',
    imagePosition: 'top',
  },
  {
    id: '4',
    image: '/placeholder.svg?height=100&width=100',
    title: 'Node 4',
    imagePosition: 'bottom',
  },
];

export function AnimatedNodeConnections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const connections = useNodeConnections(nodePositions);

  useEffect(() => {
    const updateNodePositions = () => {
      if (containerRef.current) {
        const newPositions = nodes.map((node) => {
          const element = containerRef.current?.querySelector(
            `#node-${node.id}`,
          );
          const rect = element?.getBoundingClientRect();
          return {
            id: node.id,
            x: (rect?.left || 0) + (rect?.width || 0) / 2,
            y: (rect?.top || 0) + (rect?.height || 0) / 2,
          };
        });
        setNodePositions(newPositions);
      }
    };

    updateNodePositions();
    window.addEventListener('resize', updateNodePositions);
    return () => window.removeEventListener('resize', updateNodePositions);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen p-8">
      <div className="flex flex-wrap justify-around items-center gap-8">
        {nodes.map((node) => (
          <div
            key={node.id}
            id={`node-${node.id}`}
            className="flex flex-col items-center w-32"
          >
            {node.imagePosition === 'top' && (
              <div className="w-14 h-14 rounded-full mb-4 bg-gradient-to-tr from-red-700 to-red-500"></div>
            )}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2 * Number.parseInt(node.id),
              }}
              className="rounded-lg text-center"
            >
              {node.title}
            </motion.div>
            {node.imagePosition === 'bottom' && (
              <div className="w-14 h-14 rounded-full mt-4 bg-gradient-to-tr from-red-700 to-red-500"></div>
            )}
          </div>
        ))}
      </div>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {connections.map((connection, index) => (
          <motion.path
            key={`connection-${index}`}
            d={`M${connection.start.x},${connection.start.y} Q${
              (connection.start.x + connection.end.x) / 2
            },${(connection.start.y + connection.end.y) / 2 - 50} ${
              connection.end.x
            },${connection.end.y}`}
            fill="none"
            stroke="#4CAF50"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 + 0.2 * index }}
          />
        ))}
      </svg>
    </div>
  );
}
