import { prisma } from '../lib/prisma';
import { LLMAnalysisResult } from './openai.service';

export class DatabaseService {
  /**
   * Save transcript and analysis results to database
   */
  async saveAnalysis(transcript: string, analysisResult: LLMAnalysisResult) {
    const result = await prisma.transcript.create({
      data: {
        content: transcript,
        analysis: {
          create: {
            sentiment: analysisResult.sentiment,
            sentimentSummary: analysisResult.sentimentSummary,
            actionItems: {
              create: analysisResult.actionItems.map((item) => ({
                description: item.description,
                owner: item.owner,
                deadline: item.deadline,
                priority: item.priority,
              })),
            },
            decisions: {
              create: analysisResult.decisions.map((decision) => ({
                description: decision.description,
                type: decision.type,
                context: decision.context,
              })),
            },
          },
        },
      },
      include: {
        analysis: {
          include: {
            actionItems: true,
            decisions: true,
          },
        },
      },
    });

    return result;
  }

  /**
   * Get analysis by ID with all related data
   */
  async getAnalysisById(id: string) {
    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: {
        actionItems: {
          orderBy: { createdAt: 'asc' },
        },
        decisions: {
          orderBy: { createdAt: 'asc' },
        },
        transcript: true,
      },
    });

    return analysis;
  }

  /**
   * List all analyses with summary information
   */
  async listAnalyses(limit: number = 50) {
    const analyses = await prisma.analysis.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            actionItems: true,
            decisions: true,
          },
        },
      },
    });

    return analyses.map((analysis) => ({
      id: analysis.id,
      transcriptId: analysis.transcriptId,
      sentiment: analysis.sentiment,
      createdAt: analysis.createdAt.toISOString(),
      actionItemsCount: analysis._count.actionItems,
      decisionsCount: analysis._count.decisions,
    }));
  }

  /**
   * Format analysis data for API response
   */
  formatAnalysisResponse(analysis: NonNullable<Awaited<ReturnType<typeof this.getAnalysisById>>>) {
    return {
      id: analysis.id,
      transcriptId: analysis.transcriptId,
      sentiment: analysis.sentiment,
      sentimentSummary: analysis.sentimentSummary,
      actionItems: analysis.actionItems.map((item) => ({
        id: item.id,
        description: item.description,
        owner: item.owner,
        deadline: item.deadline,
        priority: item.priority as 'high' | 'medium' | 'low' | null,
      })),
      decisions: analysis.decisions.map((decision) => ({
        id: decision.id,
        description: decision.description,
        type: decision.type as 'made' | 'pending',
        context: decision.context,
      })),
      createdAt: analysis.createdAt.toISOString(),
    };
  }
}
