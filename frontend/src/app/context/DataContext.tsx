import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Dataset {
  id: string;
  filename: string;
  uploadDate: string;
  status: "uploaded" | "processed" | "trained";
  rows: number;
  columns: string[];
}

export interface Model {
  id: string;
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  createdDate: string;
}

export interface PredictionResult {
  id: string;
  inputData: any;
  result: string;
  probability: number;
  createdDate: string;
}

interface DataContextType {
  datasets: Dataset[];
  addDataset: (dataset: Dataset) => void;
  models: Model[];
  addModel: (model: Model) => void;
  currentModel: Model | null;
  setCurrentModel: (model: Model | null) => void;
  predictions: PredictionResult[];
  addPrediction: (prediction: PredictionResult) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  const addDataset = (dataset: Dataset) => {
    setDatasets((prev) => [...prev, dataset]);
  };

  const addModel = (model: Model) => {
    setModels((prev) => [...prev, model]);
    setCurrentModel(model);
  };

  const addPrediction = (prediction: PredictionResult) => {
    setPredictions((prev) => [...prev, prediction]);
  };

  return (
    <DataContext.Provider
      value={{
        datasets,
        addDataset,
        models,
        addModel,
        currentModel,
        setCurrentModel,
        predictions,
        addPrediction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
