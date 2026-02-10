'use client';

import React from 'react';
import { Ingrediente } from '@/types';
import { Input } from '@/components/Common/Input';
import { Button } from '@/components/Common/Button';

interface IngredientRowProps {
  ingrediente: Ingrediente;
  index: number;
  onChange: (index: number, field: keyof Ingrediente, value: string | number) => void;
  onRemove: (index: number) => void;
}

export const IngredientRow: React.FC<IngredientRowProps> = ({
  ingrediente,
  index,
  onChange,
  onRemove,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {/* Nombre */}
      <div className="md:col-span-4">
        <Input
          placeholder="Ej: Arroz"
          value={ingrediente.nombre}
          onChange={(e) => onChange(index, 'nombre', e.target.value)}
        />
      </div>

      {/* Cantidad */}
      <div className="md:col-span-2">
        <Input
          type="number"
          placeholder="100"
          value={ingrediente.cantidad}
          onChange={(e) => onChange(index, 'cantidad', parseFloat(e.target.value) || 0)}
          min="0"
          step="0.1"
        />
      </div>

      {/* Unidad */}
      <div className="md:col-span-2">
        <select
          value={ingrediente.unidad}
          onChange={(e) => onChange(index, 'unidad', e.target.value)}
          className={`
            block w-full px-3 py-2 
            rounded-lg border 
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-smooth
          `}
        >
          <option value="g">gramos (g)</option>
          <option value="kg">kilogramos (kg)</option>
          <option value="ml">mililitros (ml)</option>
          <option value="l">litros (l)</option>
          <option value="unidad">unidad</option>
          <option value="taza">taza</option>
          <option value="cda">cucharada</option>
          <option value="cdita">cucharadita</option>
        </select>
      </div>

      {/* Calorías */}
      <div className="md:col-span-2">
        <Input
          type="number"
          placeholder="Kcal"
          value={ingrediente.calorias || ''}
          onChange={(e) => onChange(index, 'calorias', parseFloat(e.target.value) || 0)}
          min="0"
          step="0.1"
        />
      </div>

      {/* Remove button */}
      <div className="md:col-span-2">
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => onRemove(index)}
          fullWidth
        >
          Eliminar
        </Button>
      </div>

      {/* Macros (optional, shown below on mobile) */}
      {(ingrediente.proteina || ingrediente.carbohidratos || ingrediente.grasas) && (
        <div className="md:col-span-12 text-xs text-gray-600 dark:text-gray-400">
          Macros: 
          {ingrediente.proteina && ` P: ${ingrediente.proteina}g`}
          {ingrediente.carbohidratos && ` C: ${ingrediente.carbohidratos}g`}
          {ingrediente.grasas && ` G: ${ingrediente.grasas}g`}
        </div>
      )}
    </div>
  );
};
