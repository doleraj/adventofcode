package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import y2017.day6
import y2017.day6Second

class day6Test {
    @Test
    fun test1() {
        assertEquals(5, day6(arrayOf(0, 2, 7, 0)))
    }

    @Test
    fun testActual() {
        assertEquals(12841, day6(arrayOf(4, 10, 4, 1, 8, 4, 9, 14, 5, 1, 14, 15, 0, 15, 3, 5)))
    }

    @Test
    fun test1Second() {
        assertEquals(4, day6Second(arrayOf(0, 2, 7, 0)))
    }

    @Test
    fun testActualSecond() {
        assertEquals(8038, day6Second(arrayOf(4, 10, 4, 1, 8, 4, 9, 14, 5, 1, 14, 15, 0, 15, 3, 5)))
    }
}