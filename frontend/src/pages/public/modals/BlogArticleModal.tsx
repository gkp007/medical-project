import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  FlaskConical,
  ArrowRight,
  Share2
} from 'lucide-react';
import { BlogPost, CLINIC_INFO } from '../landingData';

interface BlogArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: BlogPost | null;
  onBookTest: () => void;
}

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({
  isOpen,
  onClose,
  article,
  onBookTest,
}) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Hero Image Header */}
        <div className="relative h-60 sm:h-72 w-full">
          <img
            alt={article.title}
            className="w-full h-full object-cover"
            src={
              article.image ||
              'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80'
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-600/40 backdrop-blur-xs">
              {article.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              {article.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>{article.author.name} ({article.author.role})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>{article.readTime}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>{article.publishDate}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Article Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-5 text-slate-700 leading-relaxed text-sm">
          <p className="text-base font-medium text-slate-900 border-l-4 border-sky-500 pl-3.5 italic bg-sky-50/50 py-2 rounded-r-xl">
            {article.excerpt}
          </p>

          <div className="space-y-4 whitespace-pre-line text-slate-600">
            {article.content}
          </div>

          {/* Related Test Callout */}
          <div className="p-4 bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Need clinical lab testing for this condition?
                </h4>
                <p className="text-xs text-slate-500">
                  Book accredited pathology tests with free doorstep home sample collection.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onBookTest();
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Book Related Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/60 backdrop-blur-xs border-t border-slate-200/60 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <span>Medical review by {CLINIC_INFO.name} Clinical Board.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

