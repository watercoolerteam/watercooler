"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AuthNavClient } from "@/components/auth-nav-client";
import { Startup } from "@prisma/client";

interface EditStartupFormProps {
  startup: Startup;
}

export default function EditStartupForm({ startup }: EditStartupFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(startup.logo || null);
  const [logoUrl, setLogoUrl] = useState<string | null>(startup.logo || null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB. Please choose a smaller image.");
      return;
    }

    setLogoFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploadingLogo(true);
    setError(null);
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

      if (!uploadData.success || !uploadData.url) {
        throw new Error("Invalid response from server. Please try again.");
      }

      setLogoUrl(uploadData.url);
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

    if (isUploadingLogo) {
      setError("Please wait for the logo to finish uploading.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
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
      logo: logoUrl || null,
      founderXLink: formData.get("founderXLink") as string,
      founderLinkedInLink: formData.get("founderLinkedInLink") as string,
      companyStage: companyStageValue && companyStageValue !== "" ? (companyStageValue as string) : null,
      financialStage: financialStageValue && financialStageValue !== "" ? (financialStageValue as string) : null,
    };

    try {
      const response = await fetch(`/api/startup/${startup.slug}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          const errorMsg = responseData.error || responseData.details || "Please check your input and try again";
          throw new Error(errorMsg);
        } else if (response.status === 403) {
          throw new Error("You don't have permission to edit this startup.");
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again in a moment.");
        } else {
          throw new Error(responseData.error || "Failed to update startup");
        }
      }

      // Redirect to the startup page
      router.push(`/startup/${startup.slug}`);
    } catch (err) {
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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm mx-4">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-gray-900 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-900 font-medium">Updating your startup...</p>
              <p className="text-sm text-gray-600 mt-2">Please wait, this may take a moment.</p>
            </div>
          </div>
        </div>
      )}
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
            <div className="flex items-center gap-6">
              <Link
                href="/browse"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Browse
              </Link>
              <AuthNavClient />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <div className="mb-6">
            <Link
              href={`/startup/${startup.slug}`}
              className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 mb-4"
            >
              ← Back to startup
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit {startup.name}
            </h1>
            <p className="text-gray-600">
              Update your startup information below.
            </p>
          </div>

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
                    defaultValue={startup.name}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
                    defaultValue={startup.oneLiner || ""}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
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
                    defaultValue={startup.description}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
                    defaultValue={startup.website || ""}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
                    defaultValue={startup.category || ""}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
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
                    defaultValue={startup.location || ""}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
                            unoptimized
                          />
                        </div>
                        {isUploadingLogo && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                            <div className="flex flex-col items-center">
                              <svg className="animate-spin h-6 w-6 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <div className="text-white text-sm font-medium">Uploading...</div>
                            </div>
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
                  ) : null}
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
                    {logoPreview ? "Upload a new logo to replace the current one" : "Upload your company logo (JPEG, PNG, WebP, or GIF, max 5MB)"}
                  </p>
                </div>

                <div>
                  <label htmlFor="companyStage" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Stage
                  </label>
                  <select
                    id="companyStage"
                    name="companyStage"
                    defaultValue={startup.companyStage || ""}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
                  >
                    <option value="">Select stage...</option>
                    <option value="IDEA">Idea</option>
                    <option value="BUILDING">Building</option>
                    <option value="PRIVATE_BETA">Private Beta</option>
                    <option value="LIVE">Live</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="financialStage" className="block text-sm font-medium text-gray-700 mb-2">
                    Funding
                  </label>
                  <select
                    id="financialStage"
                    name="financialStage"
                    defaultValue={startup.financialStage || ""}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
                  >
                    <option value="">Select stage...</option>
                    <option value="BOOTSTRAPPED">Bootstrapped</option>
                    <option value="NOT_RAISING">Not Raising</option>
                    <option value="RAISING_SOON">Raising Soon</option>
                    <option value="RAISING">Raising</option>
                    <option value="FUNDED">Funded</option>
                  </select>
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
                    defaultValue={startup.founderNames}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
                    defaultValue={startup.founderEmail}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="founderHighlight" className="block text-sm font-medium text-gray-700 mb-2">
                    Founder Highlight
                  </label>
                  <input
                    type="text"
                    id="founderHighlight"
                    name="founderHighlight"
                    defaultValue={startup.founderHighlight || ""}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="ex-Google, YC Alum, 2nd-time Founder, etc."
                  />
                </div>

                <div>
                  <label htmlFor="founderXLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Founder X (Twitter) Link
                  </label>
                  <input
                    type="url"
                    id="founderXLink"
                    name="founderXLink"
                    defaultValue={startup.founderXLink || ""}
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
                    defaultValue={startup.founderLinkedInLink || ""}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="https://linkedin.com/in/foundername"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Link
                href={`/startup/${startup.slug}`}
                className="flex-1 rounded-md border border-gray-300 px-4 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-md bg-gray-900 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Startup"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
