"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Flex,
  Input,
  MultiSelect,
  NumberInput,
  Required,
  Select,
  TextArea,
  Typography,
} from "@procore/core-react";

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M4 6l4 4 4-4H4z" />
  </svg>
);

const templateOptions = [
  { value: "above-ceiling", label: "Above Ceiling Inspection" },
  { value: "ceiling", label: "Ceiling Inspection" },
  { value: "closeout", label: "Closeout Checklist" },
];

const typeOptions = [
  { value: "quality", label: "Quality" },
  { value: "safety", label: "Safety" },
];

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in-review", label: "In Review" },
  { value: "closed", label: "Closed" },
];

const createByOptions = [
  { value: "location", label: "Location" },
  { value: "assets", label: "Assets" },
];

const locationOptions = [
  { id: "loc-1", label: "Apt 101" },
  { id: "loc-2", label: "Apt 102" },
  { id: "loc-3", label: "Apt 103" },
  { id: "loc-4", label: "Apt 101" },
  { id: "loc-5", label: "Apt 102" },
  { id: "loc-6", label: "Apt 103" },
  { id: "loc-7", label: "Apt 104" },
  { id: "loc-8", label: "Apt 105" },
  { id: "loc-9", label: "Apt 106" },
  { id: "loc-10", label: "Apt 107" },
];

export default function NewInspectionContent() {
  const router = useRouter();
  const [generalExpanded, setGeneralExpanded] = useState(true);

  const [template, setTemplate] = useState("Above Ceiling Inspection");
  const [name, setName] = useState("Above Ceiling Inspection");
  const [numberOfInspections, setNumberOfInspections] = useState(1);
  const [noValue, setNoValue] = useState("5");
  const [type, setType] = useState("Quality");
  const [status, setStatus] = useState("Open");
  const [createBy, setCreateBy] = useState<string | null>(null);
  const [trade, setTrade] = useState<string | null>(null);
  const [location, setLocation] = useState<typeof locationOptions>([]);
  const [distribution, setDistribution] = useState<string | null>(null);
  const [privateChecked, setPrivateChecked] = useState(true);
  const [specSection, setSpecSection] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [description, setDescription] = useState("1");

  const isNumberOfInspectionsFromLocations = createBy === "Location" && location.length > 0;
  const numberOfInspectionsValue = isNumberOfInspectionsFromLocations ? location.length : numberOfInspections;

  useEffect(() => {
    const { createBy: createByParam, locations: locationsParam } = router.query;
    if (typeof createByParam === "string" && (createByParam === "Location" || createByParam === "Assets")) {
      setCreateBy(createByParam);
    }
    if (typeof locationsParam === "string" && locationsParam) {
      const ids = locationsParam.split(",").map((id) => id.trim());
      const selected = locationOptions.filter((opt) => ids.includes(opt.id));
      if (selected.length > 0) setLocation(selected);
    }
  }, [router.query]);

  return (
    <Box padding="lg">
      <Box marginBottom="md">
        <Breadcrumbs>
        <Breadcrumbs.Crumb active={false}>
          <Link href="/inspections">Inspections</Link>
        </Breadcrumbs.Crumb>
        <Breadcrumbs.Crumb active>New Inspection</Breadcrumbs.Crumb>
      </Breadcrumbs>
      </Box>

      <Box marginBottom="lg">
        <Typography weight="bold" intent="h1" as="h1">
          New Inspection
        </Typography>
      </Box>

      {/* Template Selection Card */}
      <Box marginBottom="lg">
      <Card shadowStrength={1}>
        <Box padding="lg">
        <Box marginBottom="xs">
          <Typography weight="bold" intent="h3">
            Template Selection
          </Typography>
        </Box>
        <Box marginBottom="md">
          <Typography intent="body" color="gray70">
            Select default inspection template from which to create this inspection *
          </Typography>
        </Box>
        <Box style={{ maxWidth: 400 }} marginBottom="md">
          <Select
            label={template}
            onSelect={({ item }: { item: string }) => setTemplate(item)}
            placeholder="Select template"
          >
            {templateOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.label} selected={template === opt.label}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Box>
        <Box style={{ maxWidth: 400 }}>
          <Box marginBottom="xs">
            <Typography intent="label" as="label">
              Create By
            </Typography>
          </Box>
          <Select
            label={createBy ?? undefined}
            placeholder="Select"
            onSelect={({ item }: { item: string }) => setCreateBy(item)}
          >
            {createByOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.label} selected={createBy === opt.label}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Box>
        </Box>
      </Card>
      </Box>

      {/* General Information Card */}
      <Box marginBottom="xl">
      <Card shadowStrength={1}>
        <Box padding="lg">
        <Flex
          alignItems="center"
          gap="xs"
          onClick={() => setGeneralExpanded(!generalExpanded)}
          style={{ cursor: "pointer", userSelect: "none" }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setGeneralExpanded(!generalExpanded)}
          aria-expanded={generalExpanded}
        >
          <Box style={{ transform: generalExpanded ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }}>
            <ChevronDownIcon />
          </Box>
          <Typography weight="bold" intent="h3">
            General Information
          </Typography>
        </Flex>

        {generalExpanded && (
          <Box>
            <Flex wrap="wrap" gap="md" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {/* Row 1 */}
              <Box style={{ maxWidth: 220 }}>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Name
                </Typography>
                </Box>
                <Input value={name} readOnly disabled style={{ width: "100%" }} />
              </Box>
              <Box style={{ maxWidth: 220 }}>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Number of Inspections
                </Typography>
                </Box>
                <NumberInput
                  value={numberOfInspectionsValue}
                  onChange={({ parsedNumber }) => parsedNumber != null && setNumberOfInspections(parsedNumber)}
                  disabled={isNumberOfInspectionsFromLocations}
                />
              </Box>
              <Box style={{ maxWidth: 220 }}>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  No. <Required />
                </Typography>
                </Box>
                <Input value={noValue} onChange={(e) => setNoValue((e.target as HTMLInputElement).value)} style={{ width: "100%" }} />
              </Box>
              <Box>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Type
                </Typography>
                </Box>
                <Select
                  label={type}
                  onClear={() => setType("")}
                  onSelect={({ item }: { item: string }) => setType(item)}
                  placeholder="Select"
                >
                  {typeOptions.map((opt) => (
                    <Select.Option key={opt.value} value={opt.label} selected={type === opt.label}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              </Box>

              {/* Row 2 */}
              <Box>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Status <Required />
                </Typography>
                </Box>
                <Select
                  label={status}
                  onSelect={({ item }: { item: string }) => setStatus(item)}
                  placeholder="Select status"
                >
                  {statusOptions.map((opt) => (
                    <Select.Option key={opt.value} value={opt.label} selected={status === opt.label}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Trade
                </Typography>
                </Box>
                <Select
                  label={trade ?? undefined}
                  placeholder="Select a Trade"
                  onSelect={({ item }: { item: string }) => setTrade(item)}
                >
                  <Select.Option value="trade-1">Electrical</Select.Option>
                  <Select.Option value="trade-2">Plumbing</Select.Option>
                </Select>
              </Box>
              <Box>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Location
                </Typography>
                </Box>
                <MultiSelect
                  options={locationOptions}
                  value={location}
                  onChange={(value) => setLocation(value)}
                  getId={(opt) => opt.id}
                  getLabel={(opt) => opt.label}
                  placeholder="Select a Location"
                />
              </Box>
              <Box>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Distribution
                </Typography>
                </Box>
                <Select
                  label={distribution ?? undefined}
                  placeholder="Select a Person"
                  onSelect={({ item }: { item: string }) => setDistribution(item)}
                >
                  <Select.Option value="person-1">John Doe</Select.Option>
                  <Select.Option value="person-2">Jane Smith</Select.Option>
                </Select>
              </Box>

              {/* Row 3 - Private spans, then Spec Section, Equipment */}
              <Box style={{ gridColumn: "1 / 3" }}>
                <Flex alignItems="flex-start" gap="sm">
                  <Checkbox
                    checked={privateChecked}
                    onChange={(e) => setPrivateChecked((e.target as HTMLInputElement).checked)}
                    id="private-checkbox"
                  />
                  <Box>
                    <label htmlFor="private-checkbox" style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                      Private
                    </label>
                    <Typography intent="small" color="gray70" style={{ display: "block", marginTop: 4 }}>
                      Visible only to admins, distribution list members, signatories, and assignees.
                    </Typography>
                  </Box>
                </Flex>
              </Box>
              <Box>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Spec Section
                </Typography>
                </Box>
                <Select
                  label={specSection ?? undefined}
                  placeholder="Select a Specification"
                  onSelect={({ item }: { item: string }) => setSpecSection(item)}
                >
                  <Select.Option value="spec-1">Section 01</Select.Option>
                </Select>
              </Box>
              <Box>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Equipment
                </Typography>
                </Box>
                <Select
                  label={equipment ?? undefined}
                  placeholder="Select"
                  onSelect={({ item }: { item: string }) => setEquipment(item)}
                >
                  <Select.Option value="eq-1">Equipment A</Select.Option>
                </Select>
              </Box>

              {/* Row 4 - Description full width */}
              <Box style={{ gridColumn: "1 / -1" }}>
                <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Description
                </Typography>
                </Box>
                <TextArea value={description} onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)} rows={3} style={{ width: "100%", resize: "vertical" }} />
              </Box>
            </Flex>
          </Box>
        )}

        <Flex justifyContent="space-between" alignItems="center" wrap="wrap" gap="md" style={{ marginTop: 24 }}>
          <Typography intent="small" color="gray70">
            <Required showLabel>*required fields</Required>
          </Typography>
          <Flex gap="sm">
            <Button variant="secondary" onClick={() => router.push("/inspections")}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => router.push("/inspections")}>
              Create
            </Button>
          </Flex>
        </Flex>
        </Box>
      </Card>
      </Box>
    </Box>
  );
}
