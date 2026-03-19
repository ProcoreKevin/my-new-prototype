"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  OverlayTrigger,
  Search,
  Typography,
} from "@procore/core-react";

export interface LocationNode {
  id: string;
  label: string;
  children?: LocationNode[];
}

interface HierarchicalLocationSelectProps {
  options?: LocationNode[];
  value: { id: string; label: string }[];
  onChange: (value: { id: string; label: string }[]) => void;
  placeholder?: string;
}

function getLeaves(node: LocationNode): LocationNode[] {
  if (!node.children?.length) return [node];
  return node.children.flatMap(getLeaves);
}

function getAllLeaves(nodes: LocationNode[]): LocationNode[] {
  return nodes.flatMap(getLeaves);
}

function filterTree(
  nodes: LocationNode[],
  search: string
): LocationNode[] {
  const q = search.trim().toLowerCase();
  if (!q) return nodes;

  function filterNode(node: LocationNode): LocationNode | null {
    const labelMatch = node.label.toLowerCase().includes(q);
    if (!node.children?.length) return labelMatch ? node : null;
    const filteredChildren = node.children
      .map(filterNode)
      .filter((n): n is LocationNode => n != null);
    if (labelMatch || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren.length ? filteredChildren : undefined,
      };
    }
    return null;
  }

  return nodes
    .map(filterNode)
    .filter((n): n is LocationNode => n != null);
}

function isLeaf(node: LocationNode): boolean {
  return !node.children?.length;
}

function getSelectedLeafIds(
  node: LocationNode,
  selectedIds: Set<string>
): number {
  if (isLeaf(node)) return selectedIds.has(node.id) ? 1 : 0;
  const total = (node.children ?? []).reduce(
    (sum, child) => sum + getSelectedLeafIds(child, selectedIds),
    0
  );
  return total;
}

function getTotalLeaves(node: LocationNode): number {
  if (isLeaf(node)) return 1;
  return (node.children ?? []).reduce(
    (sum, child) => sum + getTotalLeaves(child),
    0
  );
}

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M6 4l4 4-4 4V4z" />
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M4 6l4 4 4-4H4z" />
  </svg>
);

const ListArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden style={{ flexShrink: 0, opacity: 0.6 }}>
    <path d="M2 3h10v1.5H2V3zm0 4h10v1.5H2V7zm0 4h6v1.5H2V11zm10-2l2 2 2-2v1.5h-4V9z" />
  </svg>
);

const defaultLocationTree: LocationNode[] = [
  {
    id: "building-a",
    label: "Building A",
    children: [
      {
        id: "building-a-floor-1",
        label: "Floor 1",
        children: [
          { id: "loc-1", label: "Apt 101" },
          { id: "loc-2", label: "Apt 102" },
          { id: "loc-3", label: "Apt 103" },
        ],
      },
    ],
  },
  {
    id: "building-b",
    label: "Building B",
    children: [
      {
        id: "building-b-floor-1",
        label: "Floor 1",
        children: [
          { id: "loc-4", label: "Apt 101" },
          { id: "loc-5", label: "Apt 102" },
          { id: "loc-6", label: "Apt 103" },
          { id: "loc-7", label: "Apt 104" },
          { id: "loc-8", label: "Apt 105" },
          { id: "loc-9", label: "Apt 106" },
          { id: "loc-10", label: "Apt 107" },
        ],
      },
    ],
  },
];

export default function HierarchicalLocationSelect({
  options = defaultLocationTree,
  value,
  onChange,
  placeholder = "Select one or more locations",
}: HierarchicalLocationSelectProps) {
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const selectedIds = useMemo(
    () => new Set(value.map((v) => v.id)),
    [value]
  );
  const allLeaves = useMemo(() => getAllLeaves(options), [options]);
  const filteredOptions = useMemo(
    () => filterTree(options, search),
    [options, search]
  );

  const selectedCount = value.length;

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLeaf = (node: LocationNode) => {
    if (!isLeaf(node)) return;
    const next = new Set(selectedIds);
    if (next.has(node.id)) next.delete(node.id);
    else next.add(node.id);
    onChange(
      allLeaves.filter((l) => next.has(l.id)).map((l) => ({ id: l.id, label: l.label }))
    );
  };

  const handleSelectAll = () => {
    onChange(allLeaves.map((l) => ({ id: l.id, label: l.label })));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleParentClick = (node: LocationNode, selected: number, total: number) => {
    const leafIdsUnder = new Set(
      getLeaves(node).map((l) => l.id)
    );
    const next = new Set(selectedIds);
    if (selected === total) {
      leafIdsUnder.forEach((id) => next.delete(id));
    } else {
      leafIdsUnder.forEach((id) => next.add(id));
    }
    onChange(
      allLeaves.filter((l) => next.has(l.id)).map((l) => ({ id: l.id, label: l.label }))
    );
  };

  function renderNode(node: LocationNode, depth: number) {
    const hasChildren = node.children && node.children.length > 0;
    const expanded = expandedIds.has(node.id);
    const total = getTotalLeaves(node);
    const selected = getSelectedLeafIds(node, selectedIds);
    const checked = total > 0 && selected === total;
    const indeterminate = selected > 0 && selected < total;
    const isLeafNode = isLeaf(node);
    const isSelected = isLeafNode && selectedIds.has(node.id);

    return (
      <Box key={node.id}>
        <Flex
          alignItems="center"
          gap="xs"
          style={{
            paddingLeft: depth * 16,
            paddingRight: 12,
            paddingTop: 6,
            paddingBottom: 6,
            cursor: "pointer",
            backgroundColor: isSelected ? "var(--color-blue10, #eff6ff)" : undefined,
            borderRadius: 4,
          }}
          onClick={() => {
            if (hasChildren) toggleExpanded(node.id);
            else toggleLeaf(node);
          }}
        >
          <Box
            style={{ width: 20, flexShrink: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleExpanded(node.id);
            }}
          >
            {hasChildren ? (
              expanded ? <ChevronDown /> : <ChevronRight />
            ) : (
              <Box style={{ width: 16, height: 16 }} />
            )}
          </Box>
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            onChange={() => {
              if (hasChildren) handleParentClick(node, selected, total);
              else toggleLeaf(node);
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label={node.label}
          />
          <Typography
            intent="body"
            as="span"
            style={{
              flex: 1,
              color: isSelected ? "var(--color-blue70, #1d4ed8)" : undefined,
            }}
          >
            {node.label}
          </Typography>
          <Box onClick={(e) => e.stopPropagation()}>
            <ListArrowIcon />
          </Box>
        </Flex>
        {hasChildren && expanded &&
          node.children!.map((child) => renderNode(child, depth + 1))}
      </Box>
    );
  }

  const triggerLabel =
    selectedCount === 0
      ? placeholder
      : selectedCount === 1
        ? "1 selected"
        : `${selectedCount} selected`;

  const overlay = (
    <Box
      style={{
        minWidth: 320,
        maxWidth: 400,
        borderRadius: 8,
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        backgroundColor: "var(--color-white, #fff)",
        border: "1px solid var(--color-gray20, #e5e7eb)",
        overflow: "hidden",
      }}
    >
      <Box padding="sm" style={{ borderBottom: "1px solid var(--color-gray20, #e5e7eb)" }}>
        <Search
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
          style={{ width: "100%" }}
        />
      </Box>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid var(--color-gray20, #e5e7eb)",
        }}
      >
        <Typography intent="small" color="gray70">
          {selectedCount} selected
        </Typography>
        <Flex gap="xs">
          <Button variant="tertiary" size="sm" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button variant="tertiary" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        </Flex>
      </Flex>
      <Box
        style={{
          maxHeight: 280,
          overflowY: "auto",
          padding: "8px 0",
        }}
      >
        {filteredOptions.map((node) => renderNode(node, 0))}
      </Box>
    </Box>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom-left"
      overlay={overlay}
      initialIsVisible={false}
      afterHide={() => setSearch("")}
    >
      <button
        type="button"
        style={{
          minHeight: 36,
          width: "100%",
          padding: "6px 12px",
          border: "1px solid var(--color-gray30, #d1d5db)",
          borderRadius: 6,
          cursor: "pointer",
          backgroundColor: "var(--color-white, #fff)",
          color: selectedCount === 0 ? "var(--color-gray70, #6b7280)" : undefined,
          textAlign: "left",
          font: "inherit",
        }}
      >
        {triggerLabel}
      </button>
    </OverlayTrigger>
  );
}
