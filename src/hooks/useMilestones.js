import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useMilestones = (projectId) => {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        const fetchMilestones = async () => {
            const { data, error } = await supabase
                .from('milestones')
                .select('*')
                .eq('project_id', projectId)
                .order('due_date', { ascending: true });

            if (error) console.error('Error fetching milestones:', error);
            else setMilestones(data);
            setLoading(false);
        };

        fetchMilestones();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'milestones', filter: `project_id=eq.${projectId}` },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setMilestones((prev) => [...prev, payload.new]);
                    } else if (payload.eventType === 'UPDATE') {
                        setMilestones((prev) => prev.map((m) => (m.id === payload.new.id ? payload.new : m)));
                    } else if (payload.eventType === 'DELETE') {
                        setMilestones((prev) => prev.filter((m) => m.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [projectId]);

    const addMilestone = async (milestone) => {
        const { data, error } = await supabase
            .from('milestones')
            .insert([{ ...milestone, project_id: projectId }])
            .select();
        if (error) throw error;
        return data[0];
    };

    const toggleMilestone = async (id, status) => {
        const { error } = await supabase
            .from('milestones')
            .update({ status: !status })
            .eq('id', id);
        if (error) throw error;
    };

    return { milestones, loading, addMilestone, toggleMilestone };
};
