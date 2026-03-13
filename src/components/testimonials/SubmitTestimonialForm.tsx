import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  role: z.string().min(1, "Please select a role"),
  cohort: z.string().max(100).optional(),
  organization: z.string().max(200).optional(),
  testimony: z.string().min(20, "Testimonial must be at least 20 characters").max(2000),
  video_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

export const SubmitTestimonialForm = () => {
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from("testimony-media")
      .upload(filePath, imageFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("testimony-media")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      setUploading(true);

      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const { error } = await supabase.from("testimonies").insert({
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role,
        cohort: data.cohort?.trim() || null,
        organization: data.organization?.trim() || null,
        testimony: data.testimony.trim(),
        video_url: data.video_url?.trim() || null,
        image_url: imageUrl,
        status: "pending",
        approved: false,
        featured: false,
      });

      if (error) throw error;

      toast.success("Thank you! Your testimonial has been submitted for review.");
      reset();
      setImageFile(null);
      setImagePreview(null);

      // Notify admin (don't wait for this)
      supabase.functions.invoke("notify-admin", {
        body: {
          type: "testimony_submitted",
          data: { name: data.name, testimony: data.testimony }
        }
      }).catch((emailError) => {
        console.error("Failed to send admin notification:", emailError);
        // Don't show error to user since testimonial was saved
      });

    } catch (error: any) {
      console.error("Error submitting testimonial:", error);
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Share Your Story</CardTitle>
        <CardDescription>
          Help inspire others by sharing your experience with our community. Your testimonial will be reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" {...register("name")} placeholder="John Doe" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select onValueChange={(value) => setValue("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Alumni">Alumni</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
                <SelectItem value="Mentor">Mentor</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>

          {/* Cohort */}
          <div className="space-y-2">
            <Label htmlFor="cohort">Cohort / Class (Optional)</Label>
            <Input id="cohort" {...register("cohort")} placeholder="DSS Class of 2026" />
            {errors.cohort && <p className="text-sm text-destructive">{errors.cohort.message}</p>}
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <Label htmlFor="organization">Organization / University (Optional)</Label>
            <Input id="organization" {...register("organization")} placeholder="University of Ghana" />
            {errors.organization && <p className="text-sm text-destructive">{errors.organization.message}</p>}
          </div>

          {/* Profile Photo */}
          <div className="space-y-2">
            <Label htmlFor="photo">Profile Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
              )}
              <div className="flex-1">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB</p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="space-y-2">
            <Label htmlFor="testimony">Your Testimonial *</Label>
            <Textarea
              id="testimony"
              {...register("testimony")}
              placeholder="Share your experience, what you learned, and how the program impacted you..."
              rows={6}
            />
            {errors.testimony && <p className="text-sm text-destructive">{errors.testimony.message}</p>}
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="video_url">Video Testimonial URL (Optional)</Label>
            <Input
              id="video_url"
              {...register("video_url")}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            />
            <p className="text-xs text-muted-foreground">YouTube or Vimeo links supported</p>
            {errors.video_url && <p className="text-sm text-destructive">{errors.video_url.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting || uploading}>
            {isSubmitting || uploading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Testimonial"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
