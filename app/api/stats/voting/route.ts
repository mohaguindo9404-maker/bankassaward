import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Statistiques générales
    const [
      { count: totalUsers },
      { count: totalVotes },
      { data: todayVotesData },
      { data: recentVotesData }
    ] = await Promise.all([
      // Total des utilisateurs (excluant les admins)
      supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .neq('role', 'SUPER_ADMIN'),
      
      // Total des votes
      supabaseAdmin
        .from('votes')
        .select('*', { count: 'exact', head: true }),
      
      // Votes d'aujourd'hui
      supabaseAdmin
        .from('votes')
        .select('timestamp, user_id')
        .gte('timestamp', Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)),
      
      // Votes récents pour calculer le temps moyen
      supabaseAdmin
        .from('votes')
        .select('timestamp, user_id')
        .order('timestamp', { ascending: false })
        .limit(100)
    ])

    // Calculer les votes uniques par utilisateur aujourd'hui
    const todayVotes = todayVotesData?.length || 0
    const uniqueTodayVoters = new Set(todayVotesData?.map(v => v.user_id)).size

    // Calculer le temps moyen entre votes
    let averageTime = 0
    if (recentVotesData && recentVotesData.length > 1) {
      const votesByUser = new Map()
      
      // Grouper les votes par utilisateur
      recentVotesData.forEach(vote => {
        if (!votesByUser.has(vote.user_id)) {
          votesByUser.set(vote.user_id, [])
        }
        votesByUser.get(vote.user_id).push(vote.timestamp)
      })
      
      // Calculer les intervalles moyens
      let totalIntervals = 0
      let intervalCount = 0
      
      votesByUser.forEach(votes => {
        votes.sort((a: number, b: number) => a - b)
        for (let i = 1; i < votes.length; i++) {
          totalIntervals += (votes[i] - votes[i-1])
          intervalCount++
        }
      })
      
      if (intervalCount > 0) {
        averageTime = Math.round(totalIntervals / intervalCount / 60) // en minutes
      }
    }

    // Statistiques par catégorie
    const { data: votesByCategory } = await supabaseAdmin
      .from('votes')
      .select('category_id')
      .not('category_id', 'is', null)

    const categoryStats = votesByCategory?.reduce((acc, vote) => {
      acc[vote.category_id] = (acc[vote.category_id] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalVotes: totalVotes || 0,
      todayVotes,
      uniqueTodayVoters,
      averageTimeMinutes: averageTime,
      categoryStats,
      mostVotedCategory: (Object.entries(categoryStats || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || null)
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
