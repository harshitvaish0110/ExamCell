import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Backpack, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ROLL_NUMBER_REGEX = /^(LCS|LIT|LCI|LCB)(\d{4})0(0[1-9]|[1-5][0-9]|60)$/i;

export default function Login() {
  const [formData, setFormData] = useState({
    rollno: "",
    otp: "",
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rollNumberError, setRollNumberError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('http://localhost:3000/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollno: formData.rollno }),
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      setIsOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('http://localhost:3000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollno: formData.rollno,
          otp: formData.otp,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      const data = await response.json();
      
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        if (data.email) {
          sessionStorage.setItem('email', JSON.stringify(data.email));
        }
        navigate('/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateRollNumber = (rollno) => {
    if (!ROLL_NUMBER_REGEX.test(rollno)) {
      setRollNumberError("Invalid roll number format. Format: LCS/LIT/LCI/LCB + XXXX (year) + 0 + 01-60");
      return false;
    }
    setRollNumberError("");
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-accent p-4">
      <Card className="w-full max-w-md shadow-lg border-ring/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-16 translate-y-16" />
        
        <CardHeader className="space-y-1 bg-card/50 backdrop-blur-sm rounded-t-lg relative z-10">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Welcome to ExamCell</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {isOtpSent ? "Enter the OTP sent to your registered email" : "Enter your roll number to receive OTP"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={isOtpSent ? handleLogin : handleSendOtp}>
          <CardContent className="space-y-4 p-6 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="rollno" className="text-foreground font-medium">Roll Number</Label>
              <Input
                id="rollno"
                type="text"
                placeholder="e.g., LCS202301"
                value={formData.rollno}
                onChange={(e) => {
                  setFormData({ ...formData, rollno: e.target.value });
                  if (e.target.value) {
                    validateRollNumber(e.target.value);
                  } else {
                    setRollNumberError("");
                  }
                }}
                required
                disabled={isOtpSent}
                className={`${rollNumberError ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"} transition-colors`}
              />
              {rollNumberError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {rollNumberError}
                </p>
              )}
            </div>
            {isOtpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground font-medium">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  required
                  className="focus-visible:ring-primary transition-colors"
                />
              </div>
            )}
            {error && (
              <div className="text-destructive text-sm text-center flex items-center justify-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-6 pt-0 relative z-10">
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer"
              disabled={isLoading || (isOtpSent ? false : !!rollNumberError)}
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--primary-foreground)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isOtpSent ? "Verifying..." : "Sending OTP..."}
                </>
              ) : (
                isOtpSent ? "Login" : "Send OTP"
              )}
            </Button>
            {isOtpSent && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => {
                  setIsOtpSent(false);
                  setFormData({ ...formData, otp: "" });
                }}
              >
                Back to Roll Number
              </Button>
            )}
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:text-primary/90 transition-colors font-medium">
                Contact Admin
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
