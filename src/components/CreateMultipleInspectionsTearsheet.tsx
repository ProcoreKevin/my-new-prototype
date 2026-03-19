"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  Flex,
  MultiSelect,
  Panel,
  Required,
  SegmentedController,
  Select,
  Typography,
  Tearsheet,
} from "@procore/core-react";
import HierarchicalLocationSelect from "./HierarchicalLocationSelect";

const templateOptions = [
  { value: "above-ceiling", label: "Above Ceiling Inspection" },
  { value: "ceiling", label: "Ceiling Inspection" },
  { value: "closeout", label: "Closeout Checklist" },
];

type LocationItem = { id: string; label: string };

const assetOptions = [
  { id: "asset-1", label: "Asset A" },
  { id: "asset-2", label: "Asset B" },
  { id: "asset-3", label: "Asset C" },
];

type SegmentType = "locations" | "assets";

interface CreateMultipleInspectionsTearsheetProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateMultipleInspectionsTearsheet({
  open,
  onClose,
}: CreateMultipleInspectionsTearsheetProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<string | null>(null);
  const [segment, setSegment] = useState<SegmentType>("locations");
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [assets, setAssets] = useState<typeof assetOptions>([]);

  const selectedCount =
    segment === "locations" ? locations.length : assets.length;
  const createButtonLabel =
    selectedCount <= 1
      ? "Create 1 Inspection"
      : `Create ${selectedCount} Inspections`;

  const handleCreate = () => {
    onClose();
    const createByValue = segment === "locations" ? "Location" : "Assets";
    const params = new URLSearchParams({ createBy: createByValue });
    if (segment === "locations" && locations.length > 0) {
      params.set("locations", locations.map((loc) => loc.id).join(","));
    }
    router.push(`/inspections/new?${params.toString()}`);
  };

  return (
    <Tearsheet open={open} onClose={onClose} aria-label="Create Multiple Inspections">
      <Panel>
        <Panel.Header>
          <Panel.Title>
            <Typography weight="bold" intent="h2" as="h2">
              Create Multiple Inspections
            </Typography>
          </Panel.Title>
        </Panel.Header>
        <Typography intent="small" color="gray70" as="p" style={{ padding: "0 24px 16px" }}>
          Create Inspections in bulk by selecting locations or assets.
        </Typography>

        <Panel.Body>
          <Card>
            <Box padding="lg">
            <Box marginBottom="lg">
              <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  Template <Required />
                </Typography>
              </Box>
              <Typography intent="small" color="gray70" as="p" style={{ marginBottom: 8 }}>
                Select the template used to create each Inspection.
              </Typography>
              <Select
                placeholder="Select a template"
                onSelect={({ item }: { item: string }) => setTemplate(item)}
                label={template ?? undefined}
              >
                {templateOptions.map((opt) => (
                  <Select.Option
                    key={opt.value}
                    value={opt.label}
                    selected={template === opt.label}
                  >
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Box>

            <Box marginBottom="md">
              <Typography
                intent="label"
                as="p"
                style={{ marginBottom: 12, display: "block" }}
              >
                Select locations or assets to create multiple Inspections
              </Typography>
              <SegmentedController
                block
                onChange={(selected) =>
                  setSegment(selected === 0 ? "locations" : "assets")
                }
              >
                <SegmentedController.Segment selected={segment === "locations"}>
                  Locations
                </SegmentedController.Segment>
                <SegmentedController.Segment selected={segment === "assets"}>
                  Assets
                </SegmentedController.Segment>
              </SegmentedController>
            </Box>

            <Box>
              <Box marginBottom="xs">
                <Typography intent="label" as="label">
                  {segment === "locations" ? "Location(s)" : "Asset(s)"}
                </Typography>
              </Box>
              {segment === "locations" ? (
                <HierarchicalLocationSelect
                  value={locations}
                  onChange={setLocations}
                  placeholder="Select one or more locations"
                />
              ) : (
                <MultiSelect
                  options={assetOptions}
                  value={assets}
                  onChange={setAssets}
                  getId={(opt) => opt.id}
                  getLabel={(opt) => opt.label}
                  placeholder="Select one or more assets"
                />
              )}
            </Box>
            </Box>
          </Card>
        </Panel.Body>

        <Panel.Footer>
          <Flex justifyContent="space-between" alignItems="center" style={{ width: "100%" }}>
            <Panel.FooterNotation>
              <Typography intent="small" color="gray70" italic>
                Notation
              </Typography>
            </Panel.FooterNotation>
            <Panel.FooterActions>
              <Flex gap="sm" alignItems="center">
                <Button variant="tertiary" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreate}>
                  {createButtonLabel}
                </Button>
              </Flex>
            </Panel.FooterActions>
          </Flex>
        </Panel.Footer>
      </Panel>
    </Tearsheet>
  );
}
