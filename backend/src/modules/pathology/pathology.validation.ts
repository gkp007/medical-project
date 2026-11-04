import { z } from 'zod';

export const saveResultsSchema = z.object({
  parameters: z.array(z.object({
    parameterId: z.string().optional(),
    code: z.string().optional(),
    value: z.union([z.number(), z.string()])
  })),
  interpretation: z.string().optional()
});

export const authorizeReportSchema = z.object({
  pathologistNotes: z.string().optional()
});

export const updateSampleStatusSchema = z.object({
  sampleStatus: z.enum(['Pending', 'Collected', 'Received', 'Rejected']),
  rejectionReason: z.string().optional()
});
