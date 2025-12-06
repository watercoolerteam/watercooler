"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.`);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB. Please choose a smaller image.");
      return;
    }

    setLogoFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    setIsUploadingLogo(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      // Check if response has the expected structure
      // createSuccessResponse returns { success: true, url: ..., filename: ... }
      if (!uploadData.success || !uploadData.url) {
        console.error("Unexpected upload response structure:", uploadData);
        throw new Error("Invalid response from server. Please try again.");
      }

      setLogoUrl(uploadData.url);
      console.log("Logo uploaded successfully:", uploadData.url);
    } catch (err) {
      console.error("Error uploading logo:", err);
      setError(err instanceof Error ? err.message : "Failed to upload logo. Please try again.");
      setLogoFile(null);
      setLogoPreview(null);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // If logo is being uploaded, wait for it
    if (isUploadingLogo) {
      setError("Please wait for the logo to finish uploading.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    // Get stage values - handle both empty strings and undefined
    const companyStageValue = formData.get("companyStage");
    const financialStageValue = formData.get("financialStage");
    
    const data = {
      name: formData.get("name") as string,
      oneLiner: formData.get("oneLiner") as string,
      description: formData.get("description") as string,
      website: formData.get("website") as string,
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      founderNames: formData.get("founderNames") as string,
      founderEmail: formData.get("founderEmail") as string,
      founderHighlight: (formData.get("founderHighlight") as string) || null,
      logo: logoUrl || (formData.get("logo") as string) || null,
      founderXLink: formData.get("founderXLink") as string,
      founderLinkedInLink: formData.get("founderLinkedInLink") as string,
      companyStage: companyStageValue && companyStageValue !== "" ? (companyStageValue as string) : null,
      financialStage: financialStageValue && financialStageValue !== "" ? (financialStageValue as string) : null,
    };
    
    console.log("Submitting data:", { ...data, founderEmail: "[REDACTED]" });

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      console.log("Response status:", response.status);
      console.log("Response data:", responseData);

      if (!response.ok) {
        // Handle different error types
        if (response.status === 400) {
          // Validation error - show specific message
          const errorMsg = responseData.error || responseData.details || "Please check your input and try again";
          console.error("Validation error:", errorMsg);
          throw new Error(errorMsg);
        } else if (response.status === 500) {
          // Server error - show generic message
          throw new Error("Server error. Please try again in a moment.");
        } else {
          throw new Error(responseData.error || "Failed to submit startup");
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      // Provide user-friendly error messages
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Submission Received!
          </h2>
          <p className="text-gray-600 mb-6">
            Your startup has been submitted for review. We'll notify you at the email you provided once it's approved.
          </p>
          <Link
            href="/"
            className="text-gray-900 font-medium hover:text-gray-700"
          >
            Return to Home →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src="/logo-icon.png"
                  alt="Watercooler"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                Watercooler
              </span>
            </Link>
            <Link
              href="/browse"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Browse Startups
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submit Your Startup
          </h1>
          <p className="text-gray-600 mb-8">
            Share your early-stage startup with the community. No account required.
          </p>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Info Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Company Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label htmlFor="oneLiner" className="block text-sm font-medium text-gray-700 mb-2">
                    One Liner <span className="text-red-500">*</span>
                    <span className="text-gray-700 font-normal ml-2">(max 120 characters)</span>
                  </label>
                  <input
                    type="text"
                    id="oneLiner"
                    name="oneLiner"
                    required
                    maxLength={120}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="A short, compelling description of your startup"
                  />
                  <p className="mt-1 text-sm text-gray-700">
                    A brief tagline that captures what your startup does
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={5}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="Tell us more about your startup..."
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="https://yourstartup.com"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="e.g., SaaS, AI, Fintech, Healthcare"
                  />
                  <p className="mt-1 text-sm text-gray-700">
                    The primary category for your startup
                  </p>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  
                  {logoPreview ? (
                    <div className="mb-4">
                      <div className="relative inline-block">
                        <div className="w-32 h-32 relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <Image
                            src={logoPreview}
                            alt="Logo preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                        {isUploadingLogo && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <div className="text-white text-sm">Uploading...</div>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                        disabled={isUploadingLogo}
                      >
                        Remove logo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="logo"
                        name="logo"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleLogoChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer"
                        disabled={isUploadingLogo}
                      />
                      <p className="mt-1 text-sm text-gray-700">
                        Upload your company logo (JPEG, PNG, WebP, or GIF, max 5MB). Images will be automatically optimized.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="companyStage" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Stage
                  </label>
                  <select
                    id="companyStage"
                    name="companyStage"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
                  >
                    <option value="">Select stage...</option>
                    <option value="IDEA">Idea</option>
                    <option value="BUILDING">Building</option>
                    <option value="PRIVATE_BETA">Private Beta</option>
                    <option value="LIVE">Live</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-700">
                    Current development stage of your startup
                  </p>
                </div>

                <div>
                  <label htmlFor="financialStage" className="block text-sm font-medium text-gray-700 mb-2">
                    Financial Stage
                  </label>
                  <select
                    id="financialStage"
                    name="financialStage"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
                  >
                    <option value="">Select stage...</option>
                    <option value="BOOTSTRAPPED">Bootstrapped</option>
                    <option value="NOT_RAISING">Not Raising</option>
                    <option value="RAISING_SOON">Raising Soon</option>
                    <option value="RAISING">Raising</option>
                    <option value="FUNDED">Funded</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-700">
                    Current funding status of your startup
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Info Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Founder Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="founderNames" className="block text-sm font-medium text-gray-700 mb-2">
                    Founder Name(s) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="founderNames"
                    name="founderNames"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="John Doe, Jane Smith"
                  />
                </div>

                <div>
                  <label htmlFor="founderEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Founder Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="founderEmail"
                    name="founderEmail"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="founder@yourstartup.com"
                  />
                  <p className="mt-1 text-sm text-gray-700">
                    We'll use this to notify you when your startup is approved and to link it to your account if you claim it later.
                  </p>
                </div>

                <div>
                  <label htmlFor="founderHighlight" className="block text-sm font-medium text-gray-700 mb-2">
                    Founder Highlight
                  </label>
                  <input
                    type="text"
                    id="founderHighlight"
                    name="founderHighlight"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="ex-Google, YC Alum, 2nd-time Founder, etc."
                  />
                  <p className="mt-1 text-sm text-gray-700">
                    Highlight notable background, achievements, or credentials (e.g., "ex-Google", "YC Alum", "2nd-time Founder")
                  </p>
                </div>

                <div>
                  <label htmlFor="founderXLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Founder X (Twitter) Link
                  </label>
                  <input
                    type="url"
                    id="founderXLink"
                    name="founderXLink"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="https://x.com/foundername"
                  />
                </div>

                <div>
                  <label htmlFor="founderLinkedInLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Founder LinkedIn Link
                  </label>
                  <input
                    type="url"
                    id="founderLinkedInLink"
                    name="founderLinkedInLink"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="https://linkedin.com/in/foundername"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-gray-900 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Startup"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
