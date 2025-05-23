export interface Component {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export interface Page {
  _id: string;
  name: string;
  path: string;
  title?: string;
  description?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  components: Component[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
} 