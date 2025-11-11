"use client";

import { creativeOptions, mockAccounts, mockPixels } from "@/lib/mock-data";
import type { Campaign } from "@/lib/types";
import type React from "react";
import { useEffect, useState } from "react";
import { useToast } from "./ToastProvider";
import { Input } from "./ui";

interface CloneCampaignModalProps {
  defaultValues?: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onClone: (campaign: Campaign) => Promise<Campaign>;
}

export function CloneCampaignModal({
  isOpen,
  defaultValues,
  onClose,
  onClone,
}: CloneCampaignModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState<Campaign>({
    id: "id" + new Date().toISOString(),
    name: defaultValues?.name!,
    automations: defaultValues?.automations!,
    conversions: Number(defaultValues?.conversions || 0),
    objective: defaultValues?.objective!,
    createdAt: new Date(),
    impressions: defaultValues?.impressions!,
    spent: defaultValues?.spent!,
    status: "paused",
    accountId: mockAccounts[0]?.id || "",
    pixelId: mockPixels[0]?.id || "",
    budget: defaultValues?.budget!,
    dailyBudget: defaultValues?.dailyBudget!,
    targeting: {
      ageMin: 18,
      ageMax: 65,
      locations: ["US"],
    },
    creative: {
      id: creativeOptions[0]?.id || "",
      name: creativeOptions[0]?.name || "",
    },
  });

  useEffect(() => {
    setFormData({
      id: "id" + new Date().toISOString(),
      name: defaultValues?.name!,
      automations: defaultValues?.automations!,
      conversions: Number(defaultValues?.conversions || 0),
      objective: defaultValues?.objective!,
      createdAt: new Date(),
      impressions: defaultValues?.impressions!,
      spent: defaultValues?.spent!,
      status: "paused",
      accountId: mockAccounts[0]?.id || "",
      pixelId: mockPixels[0]?.id || "",
      budget: defaultValues?.budget!,
      dailyBudget: defaultValues?.dailyBudget!,
      targeting: {
        ageMin: 18,
        ageMax: 65,
        locations: ["US"],
      },
      creative: {
        id: creativeOptions[0]?.id || "",
        name: creativeOptions[0]?.name || "",
      },
    });
  }, [defaultValues]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "objective") {
      setFormData((prev) => ({ ...prev, objective: value as any }));
    } else if (name === "accountId") {
      setFormData((prev) => ({ ...prev, accountId: value }));
    } else if (name === "pixelId") {
      setFormData((prev) => ({ ...prev, pixelId: value }));
    } else if (name === "creativeId") {
      const creative = creativeOptions.find((c) => c.id === value);
      setFormData((prev) => ({
        ...prev,
        creative: { id: value, name: creative?.name || "" },
      }));
    } else if (name === "targeting.ageMin") {
      setFormData((prev) => ({
        ...prev,
        targeting: { ...prev.targeting, ageMin: Number(value) },
      }));
    } else if (name === "targeting.ageMax") {
      setFormData((prev) => ({
        ...prev,
        targeting: { ...prev.targeting, ageMax: Number(value) },
      }));
    }
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.accountId && formData.pixelId;
    }
    if (step === 2) {
      return formData.creative?.id && formData.name;
    }
    if (step === 3) {
      return (
        Number(formData.budget) > 0 &&
        Number(formData.dailyBudget) > 0 &&
        Number(formData.dailyBudget) <= Number(formData.budget)
      );
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    try {
      await onClone(formData);
      addToast("Campaign Cloned successfully!", "success");
      onClose();
      setStep(1);
    } catch (error) {
      addToast("Failed to Clone campaign", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="border-b border-border p-6 flex items-center justify-between sticky top-0 bg-card">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-foreground"
          >
            Clone Campaign
          </h2>
          <button
            onClick={() => {
              onClose();
              setStep(1);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Step 1: Select Account & Pixel
              </h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account
                </label>
                <select
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {mockAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pixel
                </label>
                <select
                  name="pixelId"
                  value={formData.pixelId}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {mockPixels.map((pixel) => (
                    <option key={pixel.id} value={pixel.id}>
                      {pixel.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Step 2: Choose Creative
              </h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Sale 2025"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Campaign Objective
                </label>
                <select
                  name="objective"
                  value={formData.objective}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="conversion">Conversion</option>
                  <option value="traffic">Traffic</option>
                  <option value="engagement">Engagement</option>
                  <option value="reach">Reach</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Creative
                </label>
                <select
                  name="creativeId"
                  value={formData.creative?.id}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {creativeOptions.map((creative) => (
                    <option key={creative.id} value={creative.id}>
                      {creative.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Step 3: Budget & Targeting
              </h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Total Budget ($)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Daily Budget ($)
                </label>
                <input
                  type="number"
                  name="dailyBudget"
                  value={formData.dailyBudget}
                  onChange={handleInputChange}
                  min="1"
                  max={formData.budget}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Age Min
                  </label>
                  <Input
                    type="number"
                    name="targeting.ageMin"
                    value={formData.targeting?.ageMin}
                    onChange={handleSelectChange}
                    min="13"
                    max="120"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Age Max
                  </label>
                  <Input
                    type="number"
                    name="targeting.ageMax"
                    value={formData.targeting?.ageMax}
                    onChange={handleSelectChange}
                    min="13"
                    max="120"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded p-3 mt-4">
                <p className="text-xs font-semibold text-foreground mb-2">
                  Preview
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Campaign: {formData.name}</p>
                  <p>Objective: {formData.objective}</p>
                  <p>
                    Budget: ${formData.budget} / ${formData.dailyBudget}/day
                  </p>
                  <p>
                    Age: {formData.targeting?.ageMin}-
                    {formData.targeting?.ageMax}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
              className="flex-1 px-4 py-2 border border-input rounded-md text-foreground font-medium hover:bg-muted transition-colors"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              type="submit"
              disabled={!validateStep() || isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Loading..." : step === 3 ? "Clone" : "Next"}
            </button>
          </div>

          <div className="flex gap-1 justify-center pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
                aria-label={`Step ${s} of 3`}
              />
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
