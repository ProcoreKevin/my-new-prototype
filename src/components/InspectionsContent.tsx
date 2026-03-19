"use client";

import React, { useState } from "react";
import {
  Button,
  Table,
  Pill,
  Tabs,
  Search,
  Switch,
  Dropdown,
  Typography,
  Box,
  Flex,
} from "@procore/core-react";
import CreateMultipleInspectionsTearsheet from "./CreateMultipleInspectionsTearsheet";

const COLUMN_COUNT = 8;

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const GearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path d="M10 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm5.5 1.5l1.4-1.4a.7.7 0 0 0 0-1l-1-1a.7.7 0 0 0-1 0l-1.4 1.4A5.5 5.5 0 0 0 11.5 4.1l1.4-1.4a.7.7 0 0 0 0-1l-1-1a.7.7 0 0 0-1 0L9.1 2.1A5.5 5.5 0 0 0 4.1 4.6L2.7 3.2a.7.7 0 0 0-1 0l-1 1a.7.7 0 0 0 0 1l1.4 1.4A5.5 5.5 0 0 0 2.1 10l-1.4 1.4a.7.7 0 0 0 0 1l1 1a.7.7 0 0 0 1 0l1.4-1.4a5.5 5.5 0 0 0 3.5 2.5l-.4 1.5a.7.7 0 0 0 .7.8h1.4a.7.7 0 0 0 .7-.8l-.4-1.5a5.5 5.5 0 0 0 3.5-2.5l1.4 1.4a.7.7 0 0 0 1 0l1-1a.7.7 0 0 0 0-1L17.9 10a5.5 5.5 0 0 0 1.2-3.5 5.5 5.5 0 0 0-1.2-3.5z" />
  </svg>
);

const ViewsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <rect x="2" y="2" width="4" height="4" rx="1" />
    <rect x="9" y="2" width="4" height="4" rx="1" />
    <rect x="2" y="9" width="4" height="4" rx="1" />
    <rect x="9" y="9" width="4" height="4" rx="1" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M2 3h12v1.5l-4 4v5l-4-2v-7L2 4.5V3z" />
  </svg>
);

const ConfigureIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <circle cx="8" cy="8" r="1.5" />
    <path d="M8 3v2M8 11v2M5 8H3M13 8h-2M5.2 5.2L3.8 3.8M12.2 12.2l-1.4-1.4M5.2 10.8L3.8 12.2M12.2 3.8l-1.4 1.4" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const FullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M2 2v4h2V4h4V2H2zm8 0v2h4v4h2V2h-6zM2 10v4h6v-2H4v-2H2zm12-2h-2v4h-2v2h4v-6z" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M11.5 2.5l2 2-8 8H3.5v-2.5l8-8zM10.5 4L12 5.5 5.5 12 4 10.5 10.5 4z" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M4 2h6l4 4v8H4V2zm2 2v8h8V7H9V4H6z" />
  </svg>
);

const InsightsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path d="M2 14v2h2v-2H2zm4-4v6h2v-6H6zm4-4v10h2V6h-2zm4 2v8h2V8h-2z" />
  </svg>
);

const inspectionsData = [
  {
    group: "Above Ceiling Inspection",
    count: 4,
    rows: [
      { id: 1, name: "Above Ceiling Inspection", description: "", status: "Open" as const, inspectionDate: "12/1/2022", dueDate: "" },
      { id: 2, name: "Above Ceiling Inspection", description: "1.", status: "In Review" as const, inspectionDate: "3/6/2024", dueDate: "" },
      { id: 3, name: "Above Ceiling Inspection", description: "", status: "Open" as const, inspectionDate: "9/11/2024", dueDate: "" },
      { id: 4, name: "Above Ceiling Inspection", description: "", status: "Open" as const, inspectionDate: "9/11/2024", dueDate: "" },
    ],
  },
  {
    group: "Ceiling Inspection",
    count: 1,
    rows: [
      { id: 5, name: "Ceiling Inspection", description: "1", status: "Open" as const, inspectionDate: "9/11/2024", dueDate: "" },
    ],
  },
  {
    group: "Closeout Checklist",
    count: 5,
    rows: [
      { id: 6, name: "Closeout Checklist", description: "Checklist to track all closeout related items.", status: "Open" as const, inspectionDate: "", dueDate: "" },
    ],
  },
];

export default function InspectionsContent() {
  const [tearsheetOpen, setTearsheetOpen] = useState(false);
  const [betaEnabled, setBetaEnabled] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Above Ceiling Inspection": true,
    "Ceiling Inspection": true,
    "Closeout Checklist": true,
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  return (
    <Box padding="lg">
      {/* Page title and tabs */}
      <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="lg" wrap="wrap" gap="md">
        <Box>
          <Flex alignItems="center" gap="sm" marginBottom="sm">
            <Box aria-hidden style={{ display: "flex", alignItems: "center", color: "#6b7280" }}>
              <GearIcon />
            </Box>
            <Typography weight="bold" intent="h1" as="h1">
              Inspections
            </Typography>
          </Flex>
          <Tabs role="navigation">
            <Tabs.Tab selected>List</Tabs.Tab>
            <Tabs.Tab>Schedules</Tabs.Tab>
            <Tabs.Tab>Recycle Bin</Tabs.Tab>
          </Tabs>
        </Box>

        {/* Action bar */}
        <Flex alignItems="center" gap="md" wrap="wrap">
          <Flex alignItems="center" gap="xs">
            <Switch
              checked={betaEnabled}
              onChange={(e) => setBetaEnabled((e.target as HTMLInputElement).checked)}
              aria-label="Beta Items List"
            />
            <Typography intent="small" color="gray70">
              Beta Items List
            </Typography>
            <button type="button" aria-label="Beta info" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#6b7280" }}>
              ?
            </button>
          </Flex>
          <Dropdown label="Export" variant="secondary">
            <Dropdown.Item item="csv">Export to CSV</Dropdown.Item>
            <Dropdown.Item item="pdf">Export to PDF</Dropdown.Item>
          </Dropdown>
          <Dropdown
            label="Create"
            variant="primary"
            icon={<PlusIcon />}
            onSelect={({ item }) => {
              if (item === "inspection") setTearsheetOpen(true);
            }}
          >
            <Dropdown.Item item="inspection">New Inspection</Dropdown.Item>
            <Dropdown.Item item="template">From Template</Dropdown.Item>
          </Dropdown>
          <button type="button" aria-label="Insights" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#374151" }}>
            <InsightsIcon />
          </button>
        </Flex>
      </Flex>

      {/* Table toolbar */}
      <Flex marginBottom="md" alignItems="center" gap="md" wrap="wrap">
        <Button variant="tertiary" size="sm" icon={<ViewsIcon />}>
          Views
          <span style={{ marginLeft: 4 }}>▾</span>
        </Button>
        <Box style={{ flex: "1 1 200px", minWidth: 200, maxWidth: 320 }}>
          <Search placeholder="Search" value="" onSubmit={() => {}} />
        </Box>
        <Button variant="tertiary" size="sm" icon={<FilterIcon />}>
          Filters
        </Button>
        <Dropdown label="Template" variant="tertiary" size="sm" placement="bottom-left">
          <Dropdown.Item item="default">Default Template</Dropdown.Item>
          <Dropdown.Item item="custom">Custom</Dropdown.Item>
        </Dropdown>
        <Button variant="tertiary" size="sm" icon={<ConfigureIcon />}>
          Configure
        </Button>
        <Button variant="tertiary" size="sm" icon={<FullscreenIcon />}>
          Fullscreen
        </Button>
      </Flex>

      {/* Data table */}
      <Table.Container>
        <Table>
          <Table.Header>
            <Table.HeaderRow>
              <Table.HeaderCell snugfit>
                <Table.Checkbox aria-label="Select All Rows" />
              </Table.HeaderCell>
              <Table.HeaderCell snugfit>#</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Inspection Date</Table.HeaderCell>
              <Table.HeaderCell>Due Date</Table.HeaderCell>
              <Table.HeaderCell snugfit />
            </Table.HeaderRow>
          </Table.Header>
          <Table.Body>
            {inspectionsData.map(({ group, count, rows }) => {
              const isExpanded = expandedGroups[group] ?? true;
              return (
                <React.Fragment key={group}>
                  <Table.Group colSpan={COLUMN_COUNT} depth={0}>
                    <Table.Carat
                      expanded={isExpanded}
                      onClick={() => toggleGroup(group)}
                    />
                    <Table.GroupTitle>
                      {group} ({count})
                    </Table.GroupTitle>
                  </Table.Group>
                  {isExpanded &&
                    rows.map((row) => (
                      <Table.BodyRow key={row.id}>
                        <Table.BodyCell snugfit>
                          <Table.Checkbox aria-label="Select Row" />
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell>{row.id}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell>
                          <Table.LinkCell href="#">{row.name}</Table.LinkCell>
                        </Table.BodyCell>
                        <Table.BodyCell>
                          <Table.TextCell>{row.description || "—"}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell>
                          <Pill color={row.status === "Open" ? "green" : "UNSAFE_orange"}>
                            {row.status}
                          </Pill>
                        </Table.BodyCell>
                        <Table.BodyCell>
                          <Table.TextCell>{row.inspectionDate || "—"}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell>
                          <Table.TextCell>{row.dueDate || "—"}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.IconCell>
                            <Flex gap="xs" alignItems="center">
                              <button type="button" aria-label="Edit" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "inline-flex" }}>
                                <EditIcon />
                              </button>
                              <button type="button" aria-label="View/Copy" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "inline-flex" }}>
                                <DocumentIcon />
                              </button>
                            </Flex>
                          </Table.IconCell>
                        </Table.BodyCell>
                      </Table.BodyRow>
                    ))}
                </React.Fragment>
              );
            })}
          </Table.Body>
        </Table>
      </Table.Container>

      <CreateMultipleInspectionsTearsheet
        open={tearsheetOpen}
        onClose={() => setTearsheetOpen(false)}
      />
    </Box>
  );
}
