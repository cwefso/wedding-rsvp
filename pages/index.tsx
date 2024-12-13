import { useState } from "react";

interface FormData {
  name: string;
  attending: string;
  message?: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    attending: "yes",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setResponseMessage("Thank you for your RSVP!");
        setFormData({ name: "", attending: "yes", message: "" }); // Reset form
      } else {
        setResponseMessage(data.error || "Failed to submit RSVP.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Mike & Nicole's Wedding RSVP
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="attending"
              className="block text-sm font-medium text-gray-700"
            >
              Will you be attending?
            </label>
            <select
              id="attending"
              value={formData.attending}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="yes">Yes, I will be there!</option>
              <option value="no">Sorry, I can't make it.</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message for Mike & Nicole
            </label>
            <textarea
              id="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Write a message or well-wishes"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-2"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit RSVP"}
          </button>
          {responseMessage && (
            <p className="text-center mt-4 text-sm text-gray-600">
              {responseMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
