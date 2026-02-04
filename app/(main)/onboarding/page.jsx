"use client";
import { setUserRole } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { SPECIALTIES } from "@/lib/specialities";
import { zodResolver } from "@hookform/resolvers/zod";




import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Stethoscope, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { doctorFormSchema } from "@/lib/schema";


const OnboardingPage = () => {
  const [step, setStep] = useState("choose-role");
  const router = useRouter();
  const { data, fn: submitUserRole, loading } = useFetch(setUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      speciality: "",
      experiance: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  const specialityValue = watch("speciality");

  const handlePatientSelection = async () => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "PATIENT");

    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      toast.success("Role Selectted!");
      router.push(data.redirect);
    }
  }, [data]);


    const onDoctorSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("speciality", data.speciality);
    formData.append("experiance", data.experiance.toString());
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);

    await submitUserRole(formData);
  };

  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          onClick={() => !loading && handlePatientSelection()}
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <User className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Patient
            </CardTitle>
            <CardDescription className="mb-4">
              Book appointment, consult with doctors and manage your health-care
              journey
            </CardDescription>
            <Button
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue as Patient"
              )}
            </Button>
          </CardContent>
        </Card>
        <Card
          onClick={() => !loading && setStep("doctor-form")}
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <Stethoscope className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Doctor
            </CardTitle>
            <CardDescription className="mb-4">
              Create your professional profile,set your availability,and provide
              consultation
            </CardDescription>
            <Button
              disable={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
            >
              {" "}
              Continue as a Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "doctor-form") {
    return (
      <Card className="border-emerald-900/20">
        <CardContent className="pt-6">
          <div className="mb-6">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Complete Your Doctor Profile
            </CardTitle>
            <CardDescription>
              Please provide your professional details for verification
            </CardDescription>
          </div>

        <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="speciality">Medical Speciality</Label>
              <Select
                value={specialityValue}
                onValueChange={(value) => setValue("speciality", value)}
              >
                <SelectTrigger id="speciality">
                  <SelectValue placeholder="Select your speciality" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((spec) => (
                    <SelectItem
                      key={spec.name}
                      value={spec.name}
                      className="flex items-center gap-2"
                    >
                      <span className="text-emerald-400">{spec.icon}</span>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.speciality && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.speciality.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experiance">Years of Experiance</Label>
              <Input
              id="experiance" type="number" placeholder="eg.5"
              {...register("experiance",{valueAsNumber:true})}
              />
              {errors.experiance && <p className="text-sm font-medium text-red-500 mt-1">{errors.experiance.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Link to Credential Document</Label>
              <Input
              id="credentialUrl" type="url" placeholder="https://example.com"
              {...register("credentialUrl",)}
              />
              {errors.credentialUrl && <p className="text-sm font-medium text-red-500 mt-1">{errors.credentialUrl.message}</p>}
              <p className="text-sm text-muted-foreground">Please provide link to the medical url</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description of Your Services</Label>
              <Textarea
                id="description"
                placeholder="Describe your expertise, services, and approach to patient care..."
                rows="4"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="pt-2 flex items-center justify-between">
              <Button
               type="button"
                variant="outline"
                onClick={() => setStep("choose-role")}
                className="border-emerald-900/30"
                disabled={loading}
              >
                Back
              </Button>
              <Button 
              type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                 {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
};

export default OnboardingPage;
